import fs from 'fs';
import path from 'path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Define the interface for tool files
interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  handler: (params: any) => Promise<any>;
}

// Validates that a loaded module has the required tool properties
function isValidTool(module: any): module is ToolDefinition {
  return (
    typeof module.name === 'string' &&
    typeof module.description === 'string' &&
    typeof module.parameters === 'object' &&
    typeof module.handler === 'function'
  );
}

// Load and register all tools from the tools directory
export async function loadTools(server: McpServer) {
  const toolsDir = path.join(process.cwd(), 'tools');
  
  if (!fs.existsSync(toolsDir)) {
    console.error(`Tools directory does not exist: ${toolsDir}`);
    return;
  }

  const files = fs.readdirSync(toolsDir);
  
  for (const file of files) {
    if (file.endsWith('.ts') || file.endsWith('.js')) {
      try {
        // Use dynamic import to load the tool file
        const modulePath = path.join(toolsDir, file);
        const module = await import(modulePath);
        
        if (isValidTool(module)) {
          // Register the tool with the MCP server
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