import React from "react";
import { EmailTemplate } from "../src/components/email-template";
import { config } from "../src/data/config";
import { Resend } from "resend";
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
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: "Server Configuration Error: Missing RESEND_API_KEY environment variable in Vercel. Did you add it to the Production environment?" });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = req.body;
    console.log("Contact form payload:", body);
    
    const {
      success: zodSuccess,
      data: zodData,
      error: zodError,
    } = Email.safeParse(body);
    
    if (!zodSuccess) {
      return res.status(400).json({ error: zodError?.message });
    }

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: [config.email],
      subject: "Contact me from portfolio",
      react: React.createElement(EmailTemplate as React.FC<any>, {
        fullName: zodData.fullName,
        email: zodData.email,
        message: zodData.message,
      }),
    });

    if (resendError) {
      return res.status(500).json({ error: resendError.message || "Failed to send email via Resend" });
    }

    return res.status(200).json(resendData);
  } catch (error: any) {
    console.error("API Send Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
