import { OpenRouter } from "@openrouter/sdk";
import { tools } from "./tools.js";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenRouter({
  apiKey: process.env.AI_API_KEY,
});

const completion = await client.chat.send({
  chatRequest: {
    model: "openai/gpt-oss-20b:free",
    temperature: 0,
    tools: tools,
    messages: [
      {
        role: "system",
        content:
          "You're an AI agent, you'll assist me in the basic tasks that I ask you to.",
      },
      {
        role: "user",
        content: "What's the weather in Tokyo?",
      },
    ],
  },
});

if (completion.choices[0]) {
  console.log(completion.choices[0].message.content);
  console.log(completion.choices[0].finishReason);
}
