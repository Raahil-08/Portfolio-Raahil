import { z } from "zod";

export const config = {
  runtime: 'edge',
};

const Email = z.object({
  fullName: z.string().min(2, "Full name is invalid!"),
  email: z.string().email({ message: "Email is invalid!" }),
  message: z.string().min(10, "Message is too short!"),
});

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server Configuration Error: Missing RESEND_API_KEY environment variable in Vercel." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await req.json();
    console.log("Contact form payload:", body);
    
    const { success, data, error } = Email.safeParse(body);
    
    if (!success) {
      return new Response(JSON.stringify({ error: error?.message }), { status: 400, headers: { 'Content-Type': 'application/json' } });
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
      return new Response(JSON.stringify({ error: resendData?.message || "Failed to send email via Resend" }), { status: resendRes.status, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify(resendData), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    console.error("API Send Error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

