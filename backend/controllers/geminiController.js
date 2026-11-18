const { geminiClient, model } = require("../config/gemini");

async function generateContent(req, res) {
  const prompt = req.body && req.body.prompt;

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({
      error: "Please send a prompt",
    });
  }

  try {
    // This is the request sent from our backend to Gemini.
    const response = await geminiClient.post(
      "/models/" + model + ":generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt.trim() }],
          },
        ],
      }
    );

    const candidates = response.data && response.data.candidates;
    const text = candidates && candidates[0] && candidates[0].content
      ? candidates[0].content.parts
        .map((part) => part.text || "")
        .join("")
      : "";

    if (!text) {
      return res.status(502).json({
        error: "Gemini ne koi text return nahi kiya",
      });
    }

    return res.json({ text: text });
  } catch (error) {
    const status = error.response && error.response.status;
    const details = error.response && error.response.data;
    console.error("Gemini error:", {
      status,
      message: error.message,
      details,
    });

    if (status === 429) {
      return res.status(429).json({
        error: "Gemini API quota exhausted. Please check your API billing/quota.",
      });
    }

    if (status === 401 || status === 403) {
      return res.status(502).json({
        error: "Gemini API key is invalid or has not been granted access.",
      });
    }

    if (status === 404) {
      return res.status(502).json({
        error: "Configured Gemini model is not available for this API key.",
      });
    }

    return res.status(502).json({
      error: "Gemini se response nahi mila",
    });
  }
}

module.exports = { generateContent };
