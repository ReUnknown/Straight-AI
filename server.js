import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(express.json());

// ✅ Allow your GitHub Pages frontend
app.use(
  cors({
    origin: [
      "https://reunknown.github.io",
      "https://reunknown.github.io/Straight-AI",
      "http://localhost:3000"
    ]
  })
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const history = [];

app.post("/straight", async (req, res) => {
  const question = (req.body.question || "").trim();
  if (!question) return res.json({ answer: "" });

  history.push({ question, time: new Date().toISOString() });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content: `
You are Straight AI.
Answer only in short, blunt phrases.
If the question cannot be answered simply, reply exactly: Too gay.
If internal failure, reply: The AI became too gay to provide service.`,
        },
        { role: "user", content: question },
      ],
    });

    let answer = completion.choices?.[0]?.message?.content?.trim() || "";
    answer = answer.replace(/\s+/g, " ").replace(/\r?\n/g, " ");

    if (!answer) answer = "The AI became too gay to provide service.";
    res.json({ answer });
  } catch (err) {
    console.error("Error contacting OpenAI:", err.message);
    res.status(500).json({ answer: "Error contacting OpenAI." });
  }
});

// ✅ Admin search history (Render-only env var)
app.get("/history", (req, res) => {
  if (req.query.code === process.env.ADMIN_CODE) return res.json(history);
  res.status(403).json({ error: "Forbidden" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Straight AI backend running on port ${PORT}`));
