//Define the tools that the LLM will use here.
//We describe tools so the model knows what's available. The model doesn't HAVE these tools — it can only REQUEST them.

const tools = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description:
        "Get current weather for a city. Returns temperature and conditions.",
      parameters: {
        type: "object",
        properties: {
          city: { type: "string", description: "City name, e.g. 'Tokyo'" },
        },
        required: ["city"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "calculate",
      description: "Evaluate a mathematical expression and return the result.",
      parameters: {
        type: "object",
        properties: {
          expression: {
            type: "string",
            description: "Math expression, e.g. '(5 + 3) * 2'",
          },
        },
        required: ["expression"],
      },
    },
  },
];

export {tools}