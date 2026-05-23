import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not configured or uses placeholder value.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Fullstack API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// AI medical notes/reports analyzer proxy route
app.post("/api/analyze-report", async (req, res) => {
  const { diagnosis, notes, patientName } = req.body;

  if (!diagnosis) {
    res.status(400).json({ error: "Diagnosis is required for compilation" });
    return;
  }

  const prompt = `You are an expert friendly medical consultant reviewing a clinical note.
Patient Name: ${patientName || "Valued Patient"}
Diagnosis: ${diagnosis}
Clinical Notes: ${notes || "No notes provided"}

Please provide a highly-structured advisory document in Markdown format with the following:
1. **Simplified Explanation**: Explain the diagnosis in humble, reassuring, layperson terms.
2. **Actionable Recommendations**: Five targeted, practical recommendations for diet, sleep, exercise, and symptom tracking.
3. **Red Flags (Warning Indicators)**: Core symptoms that would require immediate clinical attention.
4. **Suggested Medical Specialist**: Specialty of physician recommended for formal follow-up.

Ensure the tone is warm, professional, informative, and deeply compassionate. Keep the layout clean and readable. Never suggest the patient bypass actual doctors.`;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response for developer mode/missing keys
      res.json({
        analysis: `### 🏥 Reassuring Health Brief

Hi **${patientName || "Valued Patient"}**, 

Here is a supportive, clear breakdown of your report for **${diagnosis}**:

1. **Simplified Explanation**
   This condition usually means your body needs supportive care, rest, and routine tracking. We are monitoring these parameters to ensure everything resolves safely and cleanly.

2. **Actionable Recommendations**
   * **Hydration**: Drink 2.5L of water daily to boost cellular recovery.
   * **Rest**: Aim for 7-8 hours of uninterrupted, restorative sleep.
   * **Pacing**: Avoid heavy stress or intense manual exertion for the next 72 hours.
   * **Nutrition**: Focus on a whole-food diet rich in antioxidants, fresh greens, and lean proteins.
   * **Log**: Keep a daily symptom log of any changes in energy or pain scores.

3. **🚨 Warning Indicators**
   * Rapid onset of high fever or uncontrollable chills.
   * Sudden breathing difficulties or chest pressure.
   * Persistent severe pain that does not improve after rest.

4. **Recommended Specialist**
   * Scheduled consultation with a specialist in General Medicine or Family/Internal Practice.

*Note: This report briefing was generated as a backup care summary system.*`
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (error) {
    console.error("Gemini analysis error:", error);
    res.status(500).json({ error: "Failed to compile medical report analysis" });
  }
});

// Configure Vite or Static Files
async function setupFrontend() {
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
    console.log(`Hospital Server is live on port ${PORT}`);
  });
}

setupFrontend().catch((err) => {
  console.error("Failed to boot hospital application server:", err);
});
