import { OpenRouter } from "@openrouter/sdk";
import { TOOL_DEFINITIONS, TOOL_IMPLEMENTATIONS } from "./tools.js";
import { REACT_SYSTEM_PROMPT } from "./prompt.js";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenRouter({
  apiKey: process.env.AI_API_KEY,
});

const messages: any[] = [
  { role: "system", content: REACT_SYSTEM_PROMPT },
  { role: "user", content: "What's the weather in Tokyo?" },
];

let finishReason: any;

do {
  const completion = await client.chat.send({
    chatRequest: {
      model: "nvidia/nemotron-3-super-120b-a12b:free",
      temperature: 0,
      tools: TOOL_DEFINITIONS,
      messages,
    },
  });

  const choice = completion.choices[0];
  if (!choice) break;

  finishReason = choice.finishReason;
  console.log("finishReason", finishReason);
  const msg = choice.message;
  //See what tool call is suggested by the LLM.
  if (msg.toolCalls && msg.toolCalls.length > 0) {
    messages.push(msg);

    for (const tc of msg.toolCalls) {
      //console.log(tc);
      const fnName = tc.function.name;
      const args =
        typeof tc.function.arguments === "string"
          ? JSON.parse(tc.function.arguments)
          : tc.function.arguments;

      const implementation = TOOL_IMPLEMENTATIONS[fnName];
      //Call the tool accordingly.
      if (implementation) {
        const result = await implementation(...Object.values(args));
        messages.push({
          role: "tool",
          toolCallId: tc.id,
          content: result,
        });
      }
    }
  } else {
    messages.push(msg);
    break;
  }
} while (finishReason === "tool_calls");

const last = messages[messages.length - 1];
if (last?.content) {
  console.log("last content", last.content);
}
