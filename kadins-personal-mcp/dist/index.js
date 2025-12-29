#!/usr/bin/env node
import {
  __commonJS,
  loadTools
} from "./chunk-IFFK3HCL.js";

// package.json
var require_package = __commonJS({
  "package.json"(exports, module) {
    module.exports = {
      name: "kadins-personal-mcp",
      version: "1.0.0",
      description: "Kadin's Personal MCP Server with comprehensive file system and command tools",
      author: "Kadin",
      license: "MIT",
      type: "module",
      bin: {
        "kadins-personal-mcp": "./kadins-personal-mcp.js"
      },
      files: [
        "dist/**/*",
        "tools/**/*",
        "kadins-personal-mcp.js"
      ],
      scripts: {
        dev: "node --loader ts-node/esm src/index.ts",
        build: "tsup src/index.ts src/toolLoader.ts --format esm --dts --clean",
        test: "NODE_OPTIONS=--experimental-vm-modules jest",
        "test:watch": "NODE_OPTIONS=--experimental-vm-modules jest --watch"
      },
      dependencies: {
        "@modelcontextprotocol/sdk": "^1.8.0",
        glob: "^10.3.10",
        "node-fetch": "^3.3.2",
        zod: "^3.24.2"
      },
      devDependencies: {
        "@types/jest": "^29.5.14",
        "@types/node": "^22.13.13",
        jest: "^29.7.0",
        "ts-jest": "^29.3.1",
        "ts-node": "^10.9.2",
        tsup: "^8.4.0",
        typescript: "^5.8.2"
      },
      jest: {
        preset: "ts-jest/presets/default-esm",
        testEnvironment: "node",
        extensionsToTreatAsEsm: [".ts"],
        moduleNameMapper: {
          "^(\\.{1,2}/.*)\\.js$": "$1"
        },
        transform: {
          "^.+\\.tsx?$": [
            "ts-jest",
            {
              useESM: true
            }
          ]
        }
      }
    };
  }
});

// src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
var packageJson = require_package();
var server = new McpServer(
  {
    name: packageJson.name,
    version: packageJson.version
  },
  {
    instructions: "These tools communicate with a reference Model Context Protocol (MCP) server."
  }
);
async function run() {
  try {
    await loadTools(server);
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP server connected via stdio");
  } catch (error) {
    console.error("Error starting MCP server:", error);
    process.exit(1);
  }
}
run();
