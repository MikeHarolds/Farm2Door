import { getSqliteClient } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await getSqliteClient().execute("select 1");
    return Response.json({ ok: true, database: "sqlite" });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
