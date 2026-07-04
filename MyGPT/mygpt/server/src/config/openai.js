import OpenAI from "openai";
import ApiError from "../utils/ApiError.js";

let openaiClient;

export const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new ApiError("OPENAI_API_KEY is not configured on the server", 500);
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  return openaiClient;
};

