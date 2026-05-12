import { NextResponse } from "next/server";
import { readWebHealthPayload } from "../../features/ops/server";

export function GET() {
  return NextResponse.json(readWebHealthPayload(), {
    headers: {
      "cache-control": "no-store"
    }
  });
}