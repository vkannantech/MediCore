#!/usr/bin/env node
// End-to-end smoke test against a running MediCore server (dev or prod).
// Submits the real HTML forms the way a browser without JavaScript would
// (Next.js server actions support progressive enhancement), so it needs no
// browser and no extra dependencies.
//
//   BASE_URL=http://127.0.0.1:3000 npm run test:smoke
//
// It creates and then deletes a temporary patient; seeded demo data is left as-is.

const BASE = (process.env.BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const ADMIN_USER = process.env.SMOKE_ADMIN_USER ?? "admin";
const ADMIN_PASS = process.env.SMOKE_ADMIN_PASS ?? "1234";

let passed = 0;
const failures = [];

function check(name, condition, detail = "") {
  if (condition) {
    passed++;
    console.log(`  \x1b[32m✔\x1b[0m ${name}`);
  } else {
    failures.push(name);
    console.log(`  \x1b[31m✘ ${name}\x1b[0m${detail ? `\n      ${detail}` : ""}`);
  }
}

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const text = (html) => decode(html.replace(/<!--.*?-->/gs, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");

class Client {
  cookie = "";

  async request(path, init = {}) {
    const res = await fetch(BASE + path, {
      redirect: "manual",
      ...init,
      headers: {
        // Browsers always send Origin on form POSTs; Next.js checks it against Host (CSRF protection).
        ...(init.method === "POST" ? { origin: new URL(BASE).origin } : {}),
        ...(init.headers ?? {}),
        ...(this.cookie ? { cookie: this.cookie } : {}),
      },
    });
    for (const c of res.headers.getSetCookie?.() ?? []) {
      const [pair] = c.split(";");
      const [key, value] = pair.split("=");
      if (key === "medicore_session") this.cookie = value ? `medicore_session=${value}` : "";
    }
    return res;
  }

  async page(path) {
    const res = await this.request(path);
    return { res, html: res.status === 200 ? await res.text() : "" };
  }

  /** Finds the form containing `marker`, fills `fields` on top of its hidden inputs and submits it. */
  async submit(path, html, marker, fields, extraHeaders = {}) {
    const forms = html.split(/<form\b/).slice(1).map((f) => f.split("</form>")[0]);
    const form = forms.find((f) => f.includes(marker));
    if (!form) throw new Error(`No form containing ${JSON.stringify(marker)} on ${path}`);

    const body = new FormData();
    for (const [, attrs] of form.matchAll(/<input\b([^>]*)>/g)) {
      const name = attrs.match(/\bname="([^"]*)"/)?.[1];
      const isHidden = /\btype="hidden"/.test(attrs);
      if (name && isHidden && !(decode(name) in fields)) body.append(decode(name), decode(attrs.match(/\bvalue="([^"]*)"/)?.[1] ?? ""));
    }
    for (const [k, v] of Object.entries(fields)) body.append(k, String(v));

    const res = await this.request(path, { method: "POST", body, headers: extraHeaders });
    const location = res.headers.get("location") ?? "";
    return { res, location, html: res.status === 200 ? await res.text() : "" };
  }

  /** Submits, follows the action's redirect and returns the resulting page. */
  async submitAndFollow(path, html, marker, fields) {
    const result = await this.submit(path, html, marker, fields);
    if (!result.location) return { ...result, page: result.html };
    const next = await this.page(new URL(result.location, BASE).pathname + new URL(result.location, BASE).search);
    return { ...result, page: next.html };
  }
}

async function login(client, username, password) {
  const { html } = await client.page("/login");
  return client.submit("/login", html, 'name="username"', { username, password });
}

async function main() {
  console.log(`MediCore smoke test → ${BASE}\n`);

  console.log("Infrastructure");
  const health = await fetch(`${BASE}/api/health`).then(async (r) => ({ status: r.status, body: await r.json() })).catch((e) => ({ status: 0, body: String(e) }));
  check("GET /api/health is 200 with database up", health.status === 200 && health.body.database === "up", JSON.stringify(health));
  const headers = (await fetch(`${BASE}/login`)).headers;
  check("security headers are set", headers.get("x-frame-options") === "DENY" && headers.get("x-content-type-options") === "nosniff");
  check("X-Powered-By is hidden", !headers.has("x-powered-by"));

  console.log("\nAuthentication");
  const anon = new Client();
  const anonDash = await anon.request("/dashboard");
  check("anonymous /dashboard redirects to /login", anonDash.status === 307 && (anonDash.headers.get("location") ?? "").endsWith("/login"));

  const bad = await login(anon, ADMIN_USER, "wrong-password");
  check("wrong password is rejected with a message", !anon.cookie && text(bad.html).includes("Invalid username or password"));

  const admin = new Client();
  const ok = await login(admin, ADMIN_USER, ADMIN_PASS);
  check("admin login redirects to /dashboard and sets session cookie", ok.location.endsWith("/dashboard") && admin.cookie.length > 0, `status=${ok.res.status} location=${ok.location}`);

  console.log("\nAdmin pages");
  const pages = {
    "/dashboard": "Command center",
    "/patients": "Patient Management",
    "/doctors": "Doctor Management",
    "/appointments": "Appointment Management",
    "/records": "Medical Records",
    "/billing": "Billing",
    "/reports": "Patient Test Reports",
  };
  const html = {};
  for (const [path, title] of Object.entries(pages)) {
    const { res, html: body } = await admin.page(path);
    html[path] = body;
    check(`${path} renders`, res.status === 200 && text(body).includes(title), `status=${res.status}`);
  }

  const dash = text(html["/dashboard"]);
  const todayCount = Number(dash.match(/Today Appointments (\d+)/)?.[1] ?? NaN);
  check("dashboard counts today's appointments (timezone-safe)", todayCount >= 1, `Today Appointments = ${todayCount}`);

  console.log("\nValidation and error handling");
  const badAge = await admin.submitAndFollow("/patients", html["/patients"], "Add</button>", { name: "Smoke Test", age: "abc", gender: "Other", phone: "9000000001" });
  check("invalid age shows a friendly error instead of crashing", text(badAge.page).includes("Age must be a whole number"), badAge.location);

  const badGender = await admin.submitAndFollow("/patients", html["/patients"], "Add</button>", { name: "Smoke Test", age: "30", gender: "Robot", phone: "9000000001" });
  check("tampered select value is rejected", text(badGender.page).includes("Gender must be one of"));

  const ghost = await admin.submitAndFollow("/appointments", html["/appointments"], "Book</button>", { patientId: "999999", doctorId: "1", date: "2030-01-01", status: "Normal" });
  check("booking for a non-existent patient shows a friendly error", text(ghost.page).includes("does not exist"), ghost.location);

  const badMoney = await admin.submitAndFollow("/billing", html["/billing"], "Save Bill", { patientId: "1", amount: "12.345", date: "2030-01-01", paymentStatus: "Paid", paymentMethod: "Cash" });
  check("amount with 3 decimals is rejected", text(badMoney.page).includes("up to 2 decimals"));

  const before = text((await admin.page("/doctors")).html).match(/Total Doctors (\d+)/)?.[1];
  const csrf = await admin
    .submit("/doctors", html["/doctors"], "Add</button>", { name: "CSRF Doctor", specialization: "General", availability: "Morning" }, { origin: "https://evil.example" })
    .catch((e) => ({ res: { status: 0 }, error: e }));
  const after = text((await admin.page("/doctors")).html).match(/Total Doctors (\d+)/)?.[1];
  check("server action from a foreign Origin is refused (CSRF)", csrf.res.status >= 400 && before === after, `status=${csrf.res.status} doctors ${before}->${after}`);

  console.log("\nPatient lifecycle");
  const name = `Smoke Test ${Date.now()}`;
  const created = await admin.submitAndFollow("/patients", html["/patients"], "Add</button>", { name, age: "41", gender: "Female", phone: "9000000002" });
  const patientId = Number(text(created.page).match(/Patient #(\d+) added/)?.[1] ?? NaN);
  check("valid patient is created", Number.isInteger(patientId), text(created.page).slice(0, 200));

  const patientsPage = (await admin.page(`/patients?q=${encodeURIComponent(name)}`)).html;
  check("patient search finds the new patient", text(patientsPage).includes(name));

  const issued = await admin.submit("/patients", patientsPage, "Create Login", {});
  const issuedText = text(issued.html);
  const username = issuedText.match(/Username: (\S+)/)?.[1];
  const password = issuedText.match(/Password: (\S+)/)?.[1];
  check("Create Login returns a random one-time password", Boolean(username && password && password.length >= 12 && !password.startsWith("Medi@")), issuedText.slice(0, 160));

  const patient = new Client();
  const patientLogin = await login(patient, username, password);
  check("patient can log in with the issued password", patientLogin.location.endsWith("/user-dashboard"), patientLogin.location);
  const pdash = await patient.page("/user-dashboard");
  check("patient dashboard renders their name", pdash.res.status === 200 && text(pdash.html).includes(name));
  const forbidden = await patient.request("/patients");
  check("patient cannot open admin pages", forbidden.status === 307 && !(forbidden.headers.get("location") ?? "").endsWith("/patients"));

  const busy = await admin.submitAndFollow("/patients", (await admin.page("/patients?q=Raju")).html, "Delete</button>", {});
  check("deleting a patient with appointments is blocked with a message", text(busy.page).includes("still linked"), busy.location);

  const delPage = (await admin.page(`/patients?q=${encodeURIComponent(name)}`)).html;
  const deleted = await admin.submitAndFollow("/patients", delPage, "Delete</button>", {});
  check("test patient is deleted", text(deleted.page).includes(`Patient #${patientId} and their portal login were deleted`), text(deleted.page).slice(0, 200));

  const revoked = await patient.request("/user-dashboard");
  check("deleted user's existing session is rejected immediately", revoked.status === 307 && (revoked.headers.get("location") ?? "").endsWith("/login"));

  console.log(`\n${passed} passed, ${failures.length} failed`);
  if (failures.length) process.exit(1);
}

main().catch((err) => {
  console.error("\nSmoke test crashed:", err);
  process.exit(1);
});
