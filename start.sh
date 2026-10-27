#!/usr/bin/env bash
# MediCore launcher — one command to set up and run the web app.
#
#   ./start.sh            set up everything and start the dev server (default)
#   ./start.sh prod       production build, served by the standalone Node server
#   ./start.sh docker     run app + MySQL as containers (docker compose)
#   ./start.sh setup      set up only (env, MySQL, deps, migrations, seed)
#   ./start.sh status     show database container + app health
#   ./start.sh stop       stop the MySQL container (and app container)
#   ./start.sh logs       follow MySQL container logs
#   ./start.sh seed       (re)run the idempotent demo seed
#   ./start.sh check      lint + typecheck + production build
#   ./start.sh reset-db   DELETE all data and recreate the database
#
# Works from any directory: paths are resolved relative to this file.
# Set DB_MODE=external in medicore-nextjs/.env to use your own MySQL instead of Docker.

set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
APP_DIR="$ROOT_DIR/medicore-nextjs"
ENV_FILE="$APP_DIR/.env"
ENV_EXAMPLE="$APP_DIR/.env.example"
DB_CONTAINER="medicore-mysql"
MIN_NODE="20.9.0"

if [[ -t 1 ]]; then
  BOLD=$'\e[1m' DIM=$'\e[2m' RED=$'\e[31m' GREEN=$'\e[32m' YELLOW=$'\e[33m' CYAN=$'\e[36m' RESET=$'\e[0m'
else
  BOLD="" DIM="" RED="" GREEN="" YELLOW="" CYAN="" RESET=""
fi

step() { printf '%s==>%s %s%s%s\n' "$CYAN" "$RESET" "$BOLD" "$*" "$RESET"; }
ok()   { printf '    %s✔%s %s\n' "$GREEN" "$RESET" "$*"; }
warn() { printf '    %s!%s %s\n' "$YELLOW" "$RESET" "$*" >&2; }
die()  { printf '%s✘ %s%s\n' "$RED" "$*" "$RESET" >&2; exit 1; }

trap 'die "Failed at line $LINENO: $BASH_COMMAND"' ERR

# ---------------------------------------------------------------- helpers

env_get() { # env_get KEY [default] — read a value from .env without sourcing it
  local line value
  line="$(grep -E "^[[:space:]]*$1=" "$ENV_FILE" 2>/dev/null | tail -n1 || true)"
  value="${line#*=}"
  value="${value%\"}"; value="${value#\"}"
  printf '%s' "${value:-${2:-}}"
}

random_hex() { # random_hex BYTES
  if command -v openssl >/dev/null 2>&1; then openssl rand -hex "$1"
  else node -e "process.stdout.write(require('crypto').randomBytes($1).toString('hex'))"; fi
}

version_ge() { [[ "$(printf '%s\n%s\n' "$2" "$1" | sort -V | head -n1)" == "$2" ]]; }

port_in_use() { (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null; }

db_mode() { env_get DB_MODE docker; }

compose() { (cd "$APP_DIR" && docker compose "$@"); }

# ---------------------------------------------------------------- steps

check_tools() {
  step "Checking tools"
  [[ -d "$APP_DIR" ]] || die "App folder not found: $APP_DIR"
  command -v node >/dev/null || die "Node.js is not installed (need >= $MIN_NODE). https://nodejs.org"
  command -v npm  >/dev/null || die "npm is not installed."
  local node_version; node_version="$(node -p 'process.versions.node')"
  version_ge "$node_version" "$MIN_NODE" || die "Node $node_version is too old; Next.js 16 needs >= $MIN_NODE."
  ok "Node $node_version, npm $(npm -v)"

  if [[ "$(db_mode)" == "docker" ]]; then
    command -v docker >/dev/null || die "Docker is not installed. Install it, or set DB_MODE=external in $ENV_FILE."
    docker info >/dev/null 2>&1 || die "Cannot talk to Docker. Start it (sudo systemctl start docker) or add your user to the docker group."
    docker compose version >/dev/null 2>&1 || die "The 'docker compose' plugin is missing."
    ok "Docker $(docker version --format '{{.Server.Version}}' 2>/dev/null), $(docker compose version --short 2>/dev/null | sed 's/^/compose /')"
  fi
}

ensure_env() {
  step "Checking configuration ($ENV_FILE)"
  if [[ ! -f "$ENV_FILE" ]]; then
    [[ -f "$ENV_EXAMPLE" ]] || die "Missing $ENV_EXAMPLE"
    local root_pw db_pw jwt
    root_pw="$(random_hex 16)"; db_pw="$(random_hex 16)"; jwt="$(random_hex 32)"
    sed -e "s|^MYSQL_ROOT_PASSWORD=.*|MYSQL_ROOT_PASSWORD=$root_pw|" \
        -e "s|^MYSQL_PASSWORD=.*|MYSQL_PASSWORD=$db_pw|" \
        -e "s|^DATABASE_URL=.*|DATABASE_URL=\"mysql://medicore:$db_pw@127.0.0.1:3307/medicore\"|" \
        -e "s|^JWT_SECRET=.*|JWT_SECRET=$jwt|" \
        "$ENV_EXAMPLE" > "$ENV_FILE"
    chmod 600 "$ENV_FILE"
    ok "Created .env with freshly generated secrets"
  else
    ok ".env found"
  fi

  local jwt url; jwt="$(env_get JWT_SECRET)"; url="$(env_get DATABASE_URL)"
  [[ ${#jwt} -ge 32 && "$jwt" != change-me* ]] || die "JWT_SECRET in .env must be a random string of 32+ characters (openssl rand -hex 32)."
  [[ "$url" == mysql://* ]] || die "DATABASE_URL in .env must start with mysql://"
  ok "DATABASE_URL -> ${url##*@}"
}

start_db() {
  if [[ "$(db_mode)" != "docker" ]]; then
    step "Using external MySQL (DB_MODE=external)"
    return
  fi
  step "Starting MySQL container ($DB_CONTAINER)"
  local port; port="$(env_get MYSQL_PORT 3307)"
  if ! docker ps --format '{{.Names}}' | grep -qx "$DB_CONTAINER" && port_in_use "$port"; then
    die "Port $port is already used by another program. Change MYSQL_PORT (and DATABASE_URL) in .env."
  fi
  compose up -d db >/dev/null 2>&1 || { compose up -d db; die "Could not start the MySQL container."; }

  local status="" waited=0
  until [[ "$status" == "healthy" ]]; do
    status="$(docker inspect -f '{{.State.Health.Status}}' "$DB_CONTAINER" 2>/dev/null || echo missing)"
    [[ "$status" == "unhealthy" || "$status" == "missing" ]] && { compose logs --tail 30 db; die "MySQL container is $status."; }
    (( waited >= 120 )) && die "MySQL did not become healthy within 120s (./start.sh logs)."
    [[ "$status" == "healthy" ]] || { sleep 2; waited=$((waited + 2)); }
  done
  ok "MySQL is healthy on 127.0.0.1:$port"
}

install_deps() {
  step "Installing dependencies"
  local stamp="$APP_DIR/node_modules/.package-lock.json"
  if [[ ! -f "$stamp" || "$APP_DIR/package-lock.json" -nt "$stamp" || "$APP_DIR/package.json" -nt "$stamp" ]]; then
    (cd "$APP_DIR" && npm ci --no-audit --no-fund)
    ok "node_modules installed"
  else
    ok "node_modules up to date"
  fi
}

migrate_db() {
  step "Applying database migrations"
  local out
  if ! out="$(cd "$APP_DIR" && npx prisma generate 2>&1)"; then
    printf '%s\n' "$out" >&2
    die "prisma generate failed (see above)."
  fi
  if ! out="$(cd "$APP_DIR" && npx prisma migrate deploy 2>&1)"; then
    printf '%s\n' "$out" >&2
    die "Database migration failed (see above)."
  fi
  printf '%s\n' "$out" | grep -E "migrations found|No pending|successfully applied" | sed 's/^/    /' || true
  ok "Schema is up to date"
}

user_count() {
  (cd "$APP_DIR" && node -e '
    require("dotenv/config");
    const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
    const { PrismaClient } = require("@prisma/client");
    const u = new URL(process.env.DATABASE_URL.replace(/^mysql:/, "mariadb:"));
    u.searchParams.set("allowPublicKeyRetrieval", "true");
    const p = new PrismaClient({ adapter: new PrismaMariaDb(u.toString()) });
    p.user.count().then((n) => { console.log(n); return p.$disconnect(); })
      .catch((e) => { console.error(e.message); process.exit(1); });
  ')
}

seed_if_empty() {
  step "Checking demo data"
  local count; count="$(user_count)"
  if [[ "$count" == "0" ]]; then
    (cd "$APP_DIR" && npx prisma db seed)
    ok "Demo data seeded"
  else
    ok "Database already has $count user(s); seed skipped (run ./start.sh seed to top up demo data)"
  fi
}

setup() {
  check_tools
  ensure_env
  start_db
  install_deps
  migrate_db
  seed_if_empty
}

app_port() {
  local port="${PORT:-$(env_get APP_PORT 3000)}"
  port_in_use "$port" && die "Port $port is busy. Stop the other program or run: PORT=3001 ./start.sh ${1:-}"
  printf '%s' "$port"
}

banner() {
  local stop="Ctrl+C (app)   ·   ./start.sh stop (database)"
  [[ "${2:-}" == "docker" ]] && stop="./start.sh stop (app + database containers)"
  cat <<EOF

${GREEN}${BOLD}MediCore is starting${RESET} → ${BOLD}http://localhost:$1${RESET}
  Admin login    admin / 1234          ${DIM}(seeded demo account; change it for real use)${RESET}
  Patient login  kannanv1 / Medi@kannanv1
  Health check   http://localhost:$1/api/health
  App folder     $APP_DIR
  Stop           $stop

EOF
}

# ---------------------------------------------------------------- commands

cmd_dev() {
  setup
  local port; port="$(app_port)"
  banner "$port"
  cd "$APP_DIR"
  exec npx next dev --port "$port"
}

cmd_prod() {
  setup
  local port; port="$(app_port prod)"
  step "Building production bundle"
  (cd "$APP_DIR" && npm run build)
  cp -r "$APP_DIR/public" "$APP_DIR/.next/standalone/"
  mkdir -p "$APP_DIR/.next/standalone/.next"
  rm -rf "$APP_DIR/.next/standalone/.next/static"
  cp -r "$APP_DIR/.next/static" "$APP_DIR/.next/standalone/.next/static"
  banner "$port"
  cd "$APP_DIR"
  set -a; # shellcheck disable=SC1090
  source "$ENV_FILE"; set +a
  # Plain-HTTP localhost: the session cookie must not be Secure-only.
  # Behind HTTPS, set COOKIE_SECURE=true in .env.
  export NODE_ENV=production PORT="$port" HOSTNAME="${HOSTNAME_BIND:-127.0.0.1}" COOKIE_SECURE="${COOKIE_SECURE:-false}"
  exec node .next/standalone/server.js
}

cmd_docker() {
  check_tools
  [[ "$(db_mode)" == "docker" ]] || die "docker mode needs DB_MODE=docker"
  ensure_env
  start_db
  install_deps
  migrate_db
  seed_if_empty
  local port="${PORT:-$(env_get APP_PORT 3000)}"
  docker ps --format '{{.Names}}' | grep -qx medicore-app || port="$(app_port docker)"
  step "Building and starting the app container"
  APP_PORT="$port" compose --profile app up -d --build app
  local waited=0
  until curl -fsS "http://127.0.0.1:$port/api/health" >/dev/null 2>&1; do
    (( waited >= 90 )) && { compose logs --tail 40 app; die "App container did not become healthy."; }
    sleep 3; waited=$((waited + 3))
  done
  ok "App container is healthy"
  banner "$port" docker
}

cmd_status() {
  ensure_env >/dev/null
  step "Status"
  if [[ "$(db_mode)" == "docker" ]]; then
    docker ps -a --filter "name=^medicore-" --format '    {{.Names}}\t{{.Status}}\t{{.Ports}}' || true
  fi
  local port="${PORT:-$(env_get APP_PORT 3000)}"
  if out="$(curl -fsS "http://127.0.0.1:$port/api/health" 2>/dev/null)"; then
    ok "App on :$port → $out"
  else
    warn "App is not answering on http://127.0.0.1:$port"
  fi
}

cmd_stop() {
  step "Stopping containers"
  compose --profile app stop
  ok "Stopped (data is kept in the medicore-mysql-data volume)"
}

cmd_reset_db() {
  [[ "$(db_mode)" == "docker" ]] || die "reset-db only manages the Docker database."
  printf '%sThis permanently deletes ALL MediCore data in the Docker database.%s Type "reset" to continue: ' "$RED" "$RESET"
  local answer; read -r answer
  [[ "$answer" == "reset" ]] || die "Cancelled."
  compose --profile app down -v
  setup
}

case "${1:-dev}" in
  dev|start)   cmd_dev ;;
  prod)        cmd_prod ;;
  docker)      cmd_docker ;;
  setup)       setup; ok "Setup complete. Run ./start.sh to start the app." ;;
  status)      cmd_status ;;
  stop)        cmd_stop ;;
  logs)        compose logs -f db ;;
  seed)        check_tools; ensure_env; start_db; (cd "$APP_DIR" && npx prisma db seed) ;;
  check)       check_tools; ensure_env; start_db; install_deps; (cd "$APP_DIR" && npx prisma generate >/dev/null && npm run check) ;;
  reset-db)    cmd_reset_db ;;
  -h|--help|help) sed -n '2,17p' "$0" | sed 's/^# \{0,1\}//' ;;
  *)           die "Unknown command '$1'. Run ./start.sh help" ;;
esac
