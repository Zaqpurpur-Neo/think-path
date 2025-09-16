// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Role = "system" | "user" | "assistant";
type Message = { role: Role; content: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { messages } = req.body as { messages: Message[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Missing messages[]" });
    }

    const apiKey = process.env.OPENROUTER_DEEPSEK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "OPENROUTER_DEEPSEK_API_KEY is not set" });
    }

    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
        "X-Title": process.env.APP_NAME || "Next.js App",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat", // pastikan model ini tersedia di akunmu
        temperature: 0.2,
        messages,
      }),
    });

    // ← Permukaan error upstream biar kelihatan jelas di client
    const text = await upstream.text();
    if (!upstream.ok) {
      console.error("OpenRouter error", upstream.status, text);
      return res.status(upstream.status).json({
        error: "Upstream error",
        status: upstream.status,
        detail: safeJSON(text),
      });
    }

    const data = safeJSON(text);
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    return res.status(200).json({ content });
  } catch (err: any) {
    console.error("API /api/chat failed:", err);
    return res.status(500).json({ error: "Server error", detail: String(err?.message || err) });
  }
}

function safeJSON(s: string) {
  try { return JSON.parse(s); } catch { return s; }
}
