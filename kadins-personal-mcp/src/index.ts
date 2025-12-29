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
