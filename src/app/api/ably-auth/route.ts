import { NextRequest, NextResponse } from "next/server";
import * as Ably from "ably";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ABLY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Ably API key not configured" },
        { status: 500 }
      );
    }

    const client = new Ably.Rest(apiKey);
    const tokenRequest = await client.auth.createTokenRequest({
      clientId,
    });

    return NextResponse.json(tokenRequest);
  } catch (error) {
    console.error("Ably auth error:", error);
    return NextResponse.json(
      { error: "Failed to create token" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ABLY_API_KEY missing" }, { status: 500 });
  }
  const client = new Ably.Rest(apiKey);
  const tokenRequest = await client.auth.createTokenRequest({ clientId: "anonymous" });
  return NextResponse.json(tokenRequest);
}