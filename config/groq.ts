import Groq from "groq-sdk";

export const client = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});
