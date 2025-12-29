#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadTools } from "./toolLoader.js";

const packageJson = require("../package.json") as any;

// Create a new MCP server
const server = new McpServer(
  {
    name: packageJson.name,
    version: packageJson.version,
  },
  {
    instructions:
      "These tools communicate with a reference Model Context Protocol (MCP) server.",
  }
);

// Implement the ping_pong tool
server.tool(
  "ping_pong",
  "Ping the server and receive a pong back",
  {},
  async () => {
    return {
      content: [{ type: "text", text: "pong" }],
    };
  }
);

// Implement the echo tool
server.tool(
  "echo",
  "Send a message to the server and receive the message back",
  { message: z.string() },
  async (params) => {
    return {
      content: [{ type: "text", text: params.message }],
    };
  }
);

// Start the server
async function run() {
  try {
    // Load tools from the tools directory
    await loadTools(server);

    // Use stdio for transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    // Since stdout is used for MCP messages, use stderr for logging
    console.error("MCP server connected via stdio");
  } catch (error) {
    console.error("Error starting MCP server:", error);
    process.exit(1);
  }
}

run();
