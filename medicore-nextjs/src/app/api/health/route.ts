import { prisma } from "@/lib/prisma";

/** Liveness/readiness probe for start.sh, Docker and load balancers. */
export async function GET() {
  const started = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok", database: "up", latencyMs: Date.now() - started });
  } catch (err) {
    console.error("[health] database check failed", err);
    return Response.json({ status: "error", database: "down" }, { status: 503 });
  }
}
