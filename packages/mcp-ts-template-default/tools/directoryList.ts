import { z } from "zod";

export const name = "directory_list";
export const description = "List directory contents with details (size, type, etc.)";
export const parameters = {
  directory: z.string().describe("The directory to list").optional().default("."),
  showHidden: z.boolean().describe("Whether to show hidden files/directories").optional().default(false)
};
export const handler = async (params: { directory: string; showHidden?: boolean }) => {
  try {
    const fs = await import("fs");
    const path = await import("path");
    
    const searchDir = params.directory || ".";
    const resolvedDir = path.resolve(searchDir);
    
    // Check if the directory is within the current working directory to prevent path traversal
    const cwd = process.cwd();
    if (!resolvedDir.startsWith(cwd)) {
      return {
        content: [{ type: "text", text: "Error: Directory traversal is not allowed" }]
      };
    }
    
    if (!fs.existsSync(resolvedDir)) {
      return {
        content: [{ type: "text", text: `Error: Directory does not exist: ${resolvedDir}` }]
      };
    }
    
    if (!fs.statSync(resolvedDir).isDirectory()) {
      return {
        content: [{ type: "text", text: `Error: Path is not a directory: ${resolvedDir}` }]
      };
    }
    
    const items = fs.readdirSync(resolvedDir);
    const results: string[] = [];
    
    for (const item of items) {
      // Skip hidden files if showHidden is false
      if (!params.showHidden && item.startsWith('.')) {
        continue;
      }
      
      const itemPath = path.join(resolvedDir, item);
      const stat = fs.statSync(itemPath);
      
      let type = stat.isDirectory() ? "DIR" : "FILE";
      let size = stat.isDirectory() ? "-" : `${stat.size} bytes`;
      let permissions = stat.mode.toString(8).slice(-3);
      
      results.push(`${type} ${permissions} ${size} ${item}`);
    }
    
    if (results.length === 0) {
      return {
        content: [{ type: "text", text: `Directory is empty: ${params.directory || "."}` }]
      };
    }
    
    return {
      content: [{ type: "text", text: `Contents of ${params.directory || "."}:\n${results.join("\n")}` }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error listing directory: ${(error as Error).message}` }]
    };
  }
};