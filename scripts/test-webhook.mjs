// scripts/test-webhook.mjs
import crypto from "crypto";

const WEBHOOK_URL = process.env.WEBHOOK_URL || "https://www.studioplayai.com/api/lemon-webhook";
const SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "studioplayai_webhook_2026";

// payload דמה (אפשר לשנות event_name)
const payload = {
  meta: {
    event_name: "subscription_created",
  },
  data: {
    id: "test_" + Date.now(),

    attributes: {
      user_email: "michalasri.shivuk@gmail.com",
      variant_name: "pro plan",
    },
  },
};

const rawBody = Buffer.from(JSON.stringify(payload), "utf8");

// אצלך בקוד verifySignature בודק HMAC sha256 ו-header שמתחיל ב-"sha256="
const digest = crypto.createHmac("sha256", SECRET).update(rawBody).digest("hex");
const signatureHeader = `sha256=${digest}`;

async function main() {
  console.log("Sending webhook to:", WEBHOOK_URL);

  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-signature": signatureHeader,
    },
    body: rawBody,
  });

  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Body:", text);
}

main().catch((e) => {
  console.error("ERROR:", e);
  process.exit(1);
});
