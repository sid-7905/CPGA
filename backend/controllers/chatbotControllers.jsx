const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const API_KEY = process.env.TOGETHER_AI_KEY;
const API_URL = "https://api.together.xyz/v1/chat/completions";

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const makeAPIRequest = async (message, retryCount = 0) => {

  try {
    const response = await axios.post(
      API_URL,
      {
        model: "meta-llama/Llama-2-70b-chat-hf", // Using more stable model
        messages: [{ role: "user", content: message } ],
        max_tokens: 1024,
        temperature: 0.7,
        request_timeout: 30000, // 30 second timeout
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // axios timeout
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Attempt ${retryCount + 1} failed:`, error.message);

    // Check if we should retry
    if (retryCount < MAX_RETRIES && (
      error.response?.status === 503 || // Service Unavailable
      error.response?.status === 429 || // Rate Limited
      error.code === 'ECONNABORTED' ||  // Timeout
      error.code === 'ETIMEDOUT'
    )) {
      await sleep(RETRY_DELAY * Math.pow(2, retryCount)); // Exponential backoff
      return makeAPIRequest(message, retryCount + 1);
    }

    throw error;
  }
};

const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    // Validate API key
    if (!API_KEY) {
      console.error("Together AI API key is not configured");
      return res.status(500).json({
        error: "API configuration error. Please check server configuration."
      });
    }

    try {
      const data = await makeAPIRequest(message);
      return res.json({ reply: data.choices[0].message.content });
    } catch (apiError) {
      // Handle specific API errors
      if (apiError.response?.status === 401) {
        console.error("Invalid API key or authentication error");
        return res.status(500).json({
          error: "Authentication error with AI service. Please check server configuration."
        });
      }

      if (apiError.response?.status === 429) {
        console.error("Rate limit exceeded");
        return res.status(429).json({
          error: "Too many requests. Please try again in a few moments."
        });
      }

      if (apiError.response?.status === 503) {
        console.error("Service temporarily unavailable");
        return res.status(503).json({
          error: "AI service is temporarily unavailable. Please try again later."
        });
      }

      // Generic error handling
      console.error("API Error:", apiError.message);
      return res.status(500).json({
        error: "Unable to process your request at this time. Please try again later."
      });
    }
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later."
    });
  }
};

module.exports = { chatWithBot };