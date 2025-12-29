var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/toolLoader.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
function isValidTool(module) {
  return typeof module.name === "string" && typeof module.description === "string" && typeof module.parameters === "object" && typeof module.handler === "function";
}
async function loadTools(server) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const toolsDir = path.join(__dirname, "..", "tools");
  if (!fs.existsSync(toolsDir)) {
    console.error(`Tools directory does not exist: ${toolsDir}`);
    return;
  }
  const files = fs.readdirSync(toolsDir);
  for (const file of files) {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
      try {
        const modulePath = path.join(toolsDir, file);
        const module = await import(modulePath);
        if (isValidTool(module)) {
          server.tool(
            module.name,
            module.description,
            module.parameters,
            module.handler
          );
          console.error(`Registered tool: ${module.name}`);
        } else {
          console.error(`Invalid tool format in file: ${file}. Required exports: name, description, parameters, handler`);
        }
      } catch (error) {
        console.error(`Error loading tool from file ${file}:`, error);
      }
    }
  }
}

export {
  __commonJS,
  loadTools
};
