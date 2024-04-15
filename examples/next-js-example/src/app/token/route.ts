import { NextRequest, NextResponse } from "next/server";
import * as Twilio from "twilio";

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "not for production" }, { status: 401 });
  }

  if (
    typeof process.env.TWILIO_ACCOUNT_SID !== "string" ||
    typeof process.env.TWILIO_API_KEY_SID !== "string" ||
    typeof process.env.TWILIO_API_KEY_SECRET !== "string"
  ) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 500 });
  }

  let AccessToken = Twilio.jwt.AccessToken;
  let token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET,
    {
      identity: "email:demo-chat@example.com",
      ttl: 3600,
    }
  );

  let grant = new AccessToken.ChatGrant({
    serviceSid: process.env.SERVICE_SID,
  });
  token.addGrant(grant);
  return NextResponse.json({ token: token.toJwt() });
}
