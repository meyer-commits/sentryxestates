// Vercel serverless function — receives the contact form POST and sends
// the message via Resend. Requires the RESEND_API_KEY environment
// variable to be set in the Vercel project (never hardcode it here).

const TO_EMAIL = "team@sentryxestates.com";
const FROM_EMAIL = "Sentryx Website <onboarding@resend.dev>";

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, email, phone, address, message } = req.body || {};

  if (!name || !email || !message) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `New inquiry from ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Phone: ${phone || "—"}`,
          `Property Location: ${address || "—"}`,
          "",
          "Message:",
          message,
        ].join("\n"),
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error("Resend error:", errText);
      res.status(502).json({ error: "Failed to send message" });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
