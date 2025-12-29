import { z } from "zod";

export const name = "file_search";
export const description = "Search for files by name, content, or pattern in a directory";
export const parameters = {
  pattern: z.string().describe("The pattern to search for (file name or content)"),
  directory: z.string().describe("The directory to search in").optional().default("."),
  searchInContent: z.boolean().describe("Whether to search in file content (true) or just filenames (false)").optional().default(false)
};
export const handler = async (params: { pattern: string; directory: string; searchInContent: boolean }) => {
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
    
    function searchRecursive(dir: string) {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          // Skip node_modules and other common directories that shouldn't be searched
          if (item !== "node_modules" && !item.startsWith(".")) {
            searchRecursive(itemPath);
          }
        } else {
          // Check filename match
          if (item.includes(params.pattern)) {
            results.push(itemPath);
          }
          // Check content match if requested
          else if (params.searchInContent) {
            try {
              const content = fs.readFileSync(itemPath, "utf-8");
              if (content.includes(params.pattern)) {
                results.push(itemPath);
              }
            } catch (e) {
              // Skip binary files or files that can't be read
            }
          }
        }
      }
    }
    
    searchRecursive(resolvedDir);
    
    if (results.length === 0) {
      return {
        content: [{ type: "text", text: `No files found matching pattern: ${params.pattern}` }]
      };
    }
    
    return {
      content: [{ type: "text", text: `Found ${results.length} file(s):\n${results.join("\n")}` }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error searching files: ${(error as Error).message}` }]
    };
  }
};