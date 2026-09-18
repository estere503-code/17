import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "submission.json");
  const payload = await readFile(filePath, "utf8");
  return new NextResponse(payload, {
    headers: { "Cache-Control": "public, max-age=60", "Content-Type": "application/json; charset=utf-8" },
  });
}
