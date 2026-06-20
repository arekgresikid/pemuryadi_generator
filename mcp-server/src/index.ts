import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// Create server instance
const server = new Server(
  {
    name: "digen-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "digen_get_pricing",
        description: "Get subscription pricing for Pemuryadi Generator (digen.id)",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "digen_get_features",
        description: "Get a list of features provided by Pemuryadi Generator",
        inputSchema: {
          type: "object",
          properties: {},
        },
      }
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;

  if (name === "digen_get_pricing") {
    return {
      content: [
        {
          type: "text",
          text: `Pemuryadi Generator (digen.id) Pricing:
- Free: Rp 0 (2 Tokens/day, Watermarked)
- Guru Pertama (1 Month): Rp 49.000 (80 Tokens)
- Guru Muda (3 Months): Rp 135.000 (250 Tokens)
- Guru Madya (6 Months): Rp 249.000 (500 Tokens) - Best Seller
- Essential (Premium 1 Month): Rp 99.000 (160 Tokens)
- Premium (3 Months): Rp 279.000 (500 Tokens)
- Promo Code: GURUHEBAT20 for 20% discount.
Website: https://digen.id`,
        },
      ],
    };
  }

  if (name === "digen_get_features") {
    return {
      content: [
        {
          type: "text",
          text: `Pemuryadi Generator (digen.id) Features:
1. Modul Ajar Kurikulum Merdeka Generator
2. RPP Generator
3. Soal AI (PG, Essay, HOTS, AKM)
4. TTS / Crossword Generator
5. KKTP & Rubrik Penilaian
6. Kalender Pendidikan & Analisis Hari Efektif
7. Deep Learning Plan
Powered by Google Gemini AI. Visit https://digen.id to use.`,
        },
      ],
    };
  }

  throw new Error(`Tool not found: ${name}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Digen MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error running MCP server:", error);
  process.exit(1);
});
