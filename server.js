require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
const PORT = process.env.PORT || 3000;
const MAX_CHARS = 40_000;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.post("/summarize", async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({ error: "Missing or empty 'text' field." });
  }

  const trimmed = text.slice(0, MAX_CHARS);

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `Summarize the following article in exactly 3 concise bullet points. Respond with ONLY valid JSON in this exact format — no markdown, no explanation, no extra keys:
{"bullets":["bullet one","bullet two","bullet three"]}

Article:
${trimmed}`,
        },
      ],
    });

    const raw = message.content[0].text.trim();

    // Validate the response is proper JSON with exactly 3 bullets
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Try to extract JSON from the response if Claude added any prose
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON found in model response.");
      parsed = JSON.parse(match[0]);
    }

    if (
      !Array.isArray(parsed.bullets) ||
      parsed.bullets.length !== 3 ||
      parsed.bullets.some((b) => typeof b !== "string")
    ) {
      return res
        .status(502)
        .json({ error: "Model returned unexpected bullet format." });
    }

    return res.json({ bullets: parsed.bullets });
  } catch (err) {
    console.error("Claude API error:", err.message);
    return res.status(502).json({ error: "Failed to summarize article." });
  }
});

app.listen(PORT, () => {
  console.log(`Browser Bullets server running at http://localhost:${PORT}`);
});
