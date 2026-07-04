import { getOpenAIClient } from "../config/openai.js";
import ApiError from "../utils/ApiError.js";

const SYSTEM_INSTRUCTIONS =
  "You are MyGPT, a helpful AI assistant. Answer clearly, use Markdown when useful, and format code in fenced code blocks.";

const getLastUserMessage = (messages) => {
  const userMessages = messages.filter((message) => message.role === "user");
  return userMessages[userMessages.length - 1]?.content || "";
};

const demoReplies = [
  {
    keywords: ["jwt", "authentication", "interview"],
    response: [
      "## JWT authentication in simple terms",
      "",
      "JWT is like a signed entry pass. After a user logs in, the backend gives the browser a token. On protected requests, the browser sends that token back, and the backend verifies it before allowing access.",
      "",
      "### MyGPT example flow",
      "",
      "1. User logs in with email and password.",
      "2. Express checks the password with bcrypt.",
      "3. The server creates a JWT containing the user id.",
      "4. React stores the token in localStorage.",
      "5. Axios sends `Authorization: Bearer <token>` on chat requests.",
      "6. The auth middleware verifies the token and attaches `req.user`.",
      "",
      "Interview line: **JWT keeps the API stateless because the server can verify the signed token without storing a session for every request.**"
    ].join("\n")
  },
  {
    keywords: ["debug", "backend", "api", "reachable"],
    response: [
      "## Backend debugging checklist",
      "",
      "When the frontend says the API is not reachable, check the path in this order:",
      "",
      "- Confirm the server is running on port `5000`.",
      "- Open `http://localhost:5000/api/health` in the browser.",
      "- Check `VITE_API_URL` in `client/.env`.",
      "- Check CORS settings in `server/src/app.js`.",
      "- Look at the browser Network tab for the exact failed request.",
      "- Check the backend terminal for MongoDB or auth errors.",
      "",
      "Example command:",
      "",
      "```powershell",
      "npm run start --prefix server",
      "```",
      "",
      "If health works but chat fails, the backend is alive and the problem is probably auth, MongoDB, or the AI provider."
    ].join("\n")
  },
  {
    keywords: ["resume", "career", "bullet", "portfolio"],
    response: [
      "## Resume bullets for MyGPT",
      "",
      "- Built a full-stack MERN AI assistant with JWT authentication, protected Express routes, and MongoDB-backed chat history.",
      "- Integrated a provider-based AI service layer supporting free demo mode, OpenAI API mode, and local Ollama mode.",
      "- Designed a responsive ChatGPT-style React interface with Markdown rendering, code block formatting, copy response actions, and dark theme UX.",
      "- Added production-minded backend features including bcrypt password hashing, rate limiting, centralized error handling, and environment-based configuration.",
      "",
      "Interview pitch: **MyGPT is not just a chat screen. It is a complete authenticated SaaS-style AI app with persistent user data, secure APIs, and swappable AI providers.**"
    ].join("\n")
  }
];

const createDemoReply = (messages) => {
  const prompt = getLastUserMessage(messages);
  const normalizedPrompt = prompt.toLowerCase();
  const matchedReply = demoReplies.find((reply) =>
    reply.keywords.some((keyword) => normalizedPrompt.includes(keyword))
  );

  if (matchedReply) {
    return matchedReply.response;
  }

  return [
    "## Demo AI response",
    "",
    `You asked: **${prompt || "No prompt provided"}**`,
    "",
    "This project is currently running in free demo mode, so no paid AI credits are required.",
    "",
    "What is working right now:",
    "",
    "- Signup and login with JWT authentication",
    "- Password hashing with bcrypt",
    "- Protected chat routes",
    "- MongoDB chat history",
    "- Markdown rendering",
    "- Copy button and dark responsive UI",
    "",
    "To use real AI later, set `AI_PROVIDER=openai` and add billing/credits to the OpenAI account."
  ].join("\n");
};

const createOllamaReply = async (messages) => {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.2";

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTIONS },
          ...messages.map((message) => ({
            role: message.role,
            content: message.content
          }))
        ]
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(
        data.error || "Ollama request failed. Make sure Ollama is running and the model is installed.",
        response.status
      );
    }

    const answer = data.message?.content?.trim();

    if (!answer) {
      throw new ApiError("Ollama returned an empty response", 502);
    }

    return answer;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("Ollama is not running. Start Ollama or switch AI_PROVIDER=demo.", 503);
  }
};

const createOpenAIReply = async (messages) => {
  try {
    const client = getOpenAIClient();

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: SYSTEM_INSTRUCTIONS,
      input: messages
    });

    const answer = response.output_text?.trim();

    if (!answer) {
      throw new ApiError("OpenAI returned an empty response", 502);
    }

    return answer;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error("OpenAI request failed:", error.message);

    if (error.code === "insufficient_quota") {
      throw new ApiError(
        "OpenAI quota exceeded. Add billing/credits to your OpenAI account or use another API key.",
        402
      );
    }

    if (error.code === "invalid_api_key" || error.status === 401) {
      throw new ApiError("OpenAI API key is invalid. Check OPENAI_API_KEY in server/.env.", 401);
    }

    if (error.code === "model_not_found" || error.status === 404) {
      throw new ApiError("OpenAI model is not available for this key. Try OPENAI_MODEL=gpt-4.1-mini.", 400);
    }

    if (error.status === 429) {
      throw new ApiError("OpenAI rate limit reached. Wait a moment and try again.", 429);
    }

    throw new ApiError("AI response failed. Check the backend terminal for the OpenAI error.", 502);
  }
};

export const createAssistantReply = async (messages) => {
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();

  if (provider === "demo") {
    return createDemoReply(messages);
  }

  if (provider === "ollama") {
    return createOllamaReply(messages);
  }

  return createOpenAIReply(messages);
};
