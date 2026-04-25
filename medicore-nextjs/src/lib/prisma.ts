import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const connectionUrl = process.env.DATABASE_URL;
if (!connectionUrl) {
  throw new Error("DATABASE_URL is not set");
}

function buildAdapterUrl(url: string) {
  const normalized = url.replace(/^mysql:\/\//, "mariadb://");
  const parsed = new URL(normalized);

  // MySQL 8 often uses caching_sha2_password locally, which needs either TLS
  // or explicit public-key retrieval support when connecting without SSL.
  if (!parsed.searchParams.has("allowPublicKeyRetrieval")) {
    parsed.searchParams.set("allowPublicKeyRetrieval", "true");
  }

  return parsed.toString();
}

const adapterUrl = buildAdapterUrl(connectionUrl);
const adapter = new PrismaMariaDb(adapterUrl);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
