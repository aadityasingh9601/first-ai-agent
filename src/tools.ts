// Search Wikipedia and return a summary
async function searchWikipedia(query: string) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${query.replace(/ /g, "_")}`;

  try {
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      return JSON.stringify({
        title: data.title || "",
        summary: (data.extract || "No summary found.").slice(0, 800),
      });
    }

    return JSON.stringify({
      error: `Page not found for '${query}'. Try a different term.`,
    });
  } catch (error: any) {
    return JSON.stringify({
      error: error.message,
    });
  }
}

// Safely evaluate a math expression
function calculateMath(expression: string) {
  try {
    const allowed = /^[0-9+\-*/(). eE]+$/;

    if (!allowed.test(expression)) {
      return JSON.stringify({
        error: `Invalid characters in: ${expression}`,
      });
    }

    const result = Function(`"use strict"; return (${expression})`)();

    return JSON.stringify({
      expression,
      result: Number(result.toFixed(6)),
    });
  } catch (error: any) {
    return JSON.stringify({
      error: error.message,
    });
  }
}

// Get current date and time
function getCurrentDate() {
  const now = new Date();
  const formatted = now.toISOString().replace("T", " ").slice(0, 19);
  return JSON.stringify({ datetime: formatted });
}

// Get weather for a location
function getWeather(location: string) {
  const conditions = ["Sunny", "Cloudy", "Rainy", "Windy", "Snowy"];
  const temp = Math.round(10 + Math.random() * 30);
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  return JSON.stringify({
    location,
    temperature: `${temp}°C`,
    condition,
    humidity: `${Math.round(40 + Math.random() * 40)}%`,
  });
}

// OpenAI-compatible tool definitions -> Sent to the API.
const TOOL_DEFINITIONS = [
  {
    type: "function" as const,
    function: {
      name: "search_wikipedia",
      description:
        "Search Wikipedia and return a summary. Use simple topic names like 'France' or 'Albert Einstein'.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The topic to search for",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "calculate",
      description: "Evaluate a math expression. Example: '(5 + 3) * 2.5'",
      parameters: {
        type: "object",
        properties: {
          expression: {
            type: "string",
            description: "The math expression to evaluate",
          },
        },
        required: ["expression"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_current_date",
      description: "Get today's date and time.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_weather",
      description: "Get the current weather for a city or location.",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "City or location name, e.g. 'Tokyo'",
          },
        },
        required: ["location"],
      },
    },
  },
];

// Map of tool name → implementation (will be used locally)
const TOOL_IMPLEMENTATIONS: Record<string, (...args: any[]) => any> = {
  search_wikipedia: searchWikipedia,
  calculate: calculateMath,
  get_current_date: getCurrentDate,
  get_weather: getWeather,
};

export { TOOL_DEFINITIONS, TOOL_IMPLEMENTATIONS };
