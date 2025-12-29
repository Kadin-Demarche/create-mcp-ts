import { z } from "zod";

export const name = "file_list";
export const description = "List files in a directory with optional filtering";
export const parameters = {
  directory: z.string().describe("The directory to list").optional().default("."),
  filter: z.string().describe("Optional filter pattern to match files").optional(),
  recursive: z.boolean().describe("Whether to list files recursively").optional().default(false)
};
export const handler = async (params: { directory: string; filter?: string; recursive?: boolean }) => {
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
    
    const results: string[] = [];
    
    function listDirectory(dir: string, isRoot: boolean = true) {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const relativePath = path.relative(resolvedDir, itemPath);
        
        // Apply filter if provided
        if (params.filter && !item.includes(params.filter)) {
          continue;
        }
        
        // Skip node_modules and other common directories when not in recursive mode
        if (!params.recursive && !isRoot && (item === "node_modules" || item.startsWith("."))) {
          continue;
        }
        
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          if (params.recursive && item !== "node_modules" && !item.startsWith(".")) {
            results.push(`${relativePath}/ (directory)`);
            listDirectory(itemPath, false);
          } else if (!params.recursive) {
            results.push(`${relativePath}/ (directory)`);
          }
        } else {
          results.push(`${relativePath} (${stat.size} bytes)`);
        }
      }
    }
    
    listDirectory(resolvedDir);
    
    if (results.length === 0) {
      return {
        content: [{ type: "text", text: `No files found in directory: ${resolvedDir}` }]
      };
    }
    
    return {
      content: [{ type: "text", text: `Files in ${params.directory || "."}:\n${results.join("\n")}` }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error listing files: ${(error as Error).message}` }]
    };
  }
};