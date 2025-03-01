import { NextResponse } from "next/server";

export async function GET() {
  // Generate random data for download test
  const size = 1024 * 1024; // 1MB
  const buffer = new ArrayBuffer(size);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < size; i++) {
    view[i] = Math.floor(Math.random() * 256);
  }

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Cache-Control": "no-store",
    },
  });
}
