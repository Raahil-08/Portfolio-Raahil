import { z } from "zod";

const Email = z.object({
  fullName: z.string().min(2, "Full name is invalid!"),
  email: z.string().email({ message: "Email is invalid!" }),
  message: z.string().min(10, "Message is too short!"),
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server Configuration Error: Missing RESEND_API_KEY environment variable in Vercel." });
    }

    const body = req.body;
    console.log("Contact form payload:", body);
    
    const { success, data, error } = Email.safeParse(body);
    
    if (!success) {
      return res.status(400).json({ error: error?.message });
    }

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio <onboarding@resend.dev>",
        to: ["raahildesai8@gmail.com"],
        subject: "Contact me from portfolio",
        html: `<div>
          <h1>from: ${data.fullName}!</h1>
          <div style="color: red;">${data.email} sent you a message</div>
          <blockquote>${data.message}</blockquote>
        </div>`
      })
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      return res.status(resendRes.status).json({ error: resendData?.message || "Failed to send email via Resend" });
    }

    return res.status(200).json(resendData);
  } catch (err: any) {
    console.error("API Send Error:", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}

