#!/bin/bash
# Runs once, on first container start. Lets the app user create Prisma's
# temporary shadow databases so `prisma migrate dev` works without root.
set -e
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" <<SQL
GRANT ALL PRIVILEGES ON \`prisma_migrate_shadow_db_%\`.* TO '$MYSQL_USER'@'%';
FLUSH PRIVILEGES;
SQL
