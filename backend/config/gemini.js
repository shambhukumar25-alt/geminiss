const axios = require("axios");

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || "gemini-flash-latest";

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const geminiClient = axios.create({
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  timeout: 60000,
  params: { key: apiKey },
  headers: { "Content-Type": "application/json" },
});

module.exports = { geminiClient, model };
