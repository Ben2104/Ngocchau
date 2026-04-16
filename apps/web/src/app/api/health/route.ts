import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "web-ok",
    data: {
      service: "web",
      timestamp: new Date().toISOString()
    }
  });
}

