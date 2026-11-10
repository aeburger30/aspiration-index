import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API endpoint for secure psychological feedback
  app.post("/api/feedback", async (req, res) => {
    try {
      const { scores, ageGroup, demographic, mainAspiration, factorScores } = req.body;

      if (!scores) {
        return res.status(400).json({ error: "Missing score data matrix." });
      }

      // Initialize Gemini client on the server
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "Gemini API key is not configured on the server. Please add it to your secrets via the Settings panel.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Construct a highly detailed context-rich prompt based on Self-Determination Theory
      const prompt = `You are an expert educational counselor and research psychologist specializing in Self-Determination Theory (SDT) and human motivation. 
Analyze the following student score profile from the Aspiration Index (Kasser & Ryan).

The Aspiration Index measures 7 aspiration categories, classified into Extrinsic, Intrinsic, and Neutral (Health) factors:
- **Extrinsic Goals (Aspirations focus on external rewards, status, and others' approval)**: Wealth, Fame, Image
- **Intrinsic Goals (Aspirations focus on basic psychological needs: autonomy, competence, relatedness)**: Personal Growth, Relationships, Community
- **Neutral/Companion Goal**: Health (important indicator of somatic well-being, though not strictly categorized as intrinsic/extrinsic in basic factoring)

For each category, the student completed five specific long-term goals. For each goal they provided three ratings on a 1-7 scale (where 1 is "not at all", 4 is "moderately", 7 is "very much"):
1. **Importance**: The personal value placed on the aspiration.
2. **Likelihood**: Their subjective expectation/optimism of attaining it in the future.
3. **Attainment/Satisfaction**: The degree to which they have already achieved or are currently satisfied with this life goal.

Student Background Context (if provided):
- Age Group/Level: ${ageGroup || "Unspecified student level"}
- Context/Topic of Interest: ${demographic || "General education"}
- Primary self-reported general aspiration focus: "${mainAspiration || "Not explicitly specified"}"

Student Aspiration Matrix (Averaged Subscale Scores, 1-7 Scale):
${Object.entries(scores)
  .map(([cat, val]: [string, any]) => {
    return `- **${cat}**:
  - Importance: ${val.importance.toFixed(2)} / 7
  - Likelihood of Future Attainment: ${val.likelihood.toFixed(2)} / 7
  - Current Attainment/Satisfaction: ${val.attainment.toFixed(2)} / 7`;
  })
  .join("\n")}

Factor Analysis:
- **Intrinsic Importance Score (Average of Personal Growth, Relationships, Community Importance)**: ${factorScores?.intrinsicImportance?.toFixed(2) || "N/A"}
- **Extrinsic Importance Score (Average of Wealth, Fame, Image Importance)**: ${factorScores?.extrinsicImportance?.toFixed(2) || "N/A"}
- **Relative Intrinsic Value Index (Intrinsic Importance minus Extrinsic Importance)**: ${(factorScores?.intrinsicImportance - factorScores?.extrinsicImportance)?.toFixed(2) || "N/A"}
- **Overall Likelihood (Intrinsic vs. Extrinsic)**: Intrinsic Likelihood is ${factorScores?.intrinsicLikelihood?.toFixed(2)}, Extrinsic Likelihood is ${factorScores?.extrinsicLikelihood?.toFixed(2)}.
- **Overall Attainment (Intrinsic vs. Extrinsic)**: Intrinsic Attainment is ${factorScores?.intrinsicAttainment?.toFixed(2)}, Extrinsic Attainment is ${factorScores?.extrinsicAttainment?.toFixed(2)}.

Your task is to write a highly professional, encouraging, and deeply reflective **Educational Aspiration Portrait** for the student. Do not use academic jargon without explaining it. Speak directly to the student in a supportive, validating, and informative tone.

Write the report in a highly organized, beautifully formatted Markdown structure with the following clear sections:

### 🌟 Your Motivational Orientation Profile
Identify their profile type (e.g., "The Growth Seekers", "The Community Builders", "The Balanced Realists", "The Status-Driven Achievers", or "The Harmonious Integrators") based on their Intrinsic/Extrinsic balance and highest importance subscales. Describe what this means for their day-to-day choices, values, and well-being. Refer to Self-Determination Theory (meaningful relationships, personal growth, community contributions vs wealth/fame/image) so they learn the science.

### 📊 Intrinsic vs. Extrinsic Aspiration Analysis
Explain the concept of Intrinsic and Extrinsic aspirations in a friendly way. 
Discuss their specific Intrinsic-Extrinsic balance (The Relative Intrinsic Value Index) and why research shows that intrinsic goals are generally linked with deeper, long-lived vitality and emotional well-being compared to chasing fame or wealth. If their extrinsic values are high, address this with gentle, non-judgmental guidance about how extrinsic goals can be healthy *if* they are aligned with and serve deeper intrinsic needs (e.g., money is useful as a tool for security or helping others, rather than as an end in itself).

### ⚖️ The Aspiration-Attainment Gap
Conduct a dynamic comparison between what they rate as **Important** versus what they feel they have **Attained** so far:
- Highlight areas of "High Harmony" (high importance and high current satisfaction/attainment).
- Address areas of "Aspiration Gaps" (high importance but low current attainment or low expectation).
- Frame these gaps not as failures, but as **high-interest opportunities for personal design, reflection, and growth**.

### ⚓ Health & Vitality as an Anchor
Analyze their health scores briefly. Discuss how their physical well-being acts as a supportive vessel/anchor for pursuing both learning (growth) and contributing to others (community).

### 💡 Actionable Reflections for Your Life-Path
Provide 3 tailored, highly reflective questions or small, practical action steps designed specifically for their profile layout to help them cultivate autonomy, competence, and deeper relatedness.

Keep the advice strictly focused on psychological education, avoid diagnosing anything, and keep the tone exceptionally student-centered, intellectual, and inspiring. Maintain absolute privacy by acknowledging that no personal details are saved or tracked. Do not refer to database entities or backend systems.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
        },
      });

      res.json({ feedback: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error?.message || "Failed to generate AI feedback reflection." });
    }
  });

  // Serve static files in production / setup Vite middleware in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
