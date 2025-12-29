import { z } from "zod";

export const name = "list_files";
export const description = "List the names of files and subdirectories in a specified directory";
export const parameters = {
  path: z.string().describe("The directory path to list").optional().default("."),
  show_hidden: z.boolean().describe("Whether to show hidden files/directories").optional().default(false),
  max_items: z.number().describe("Maximum number of items to return").optional().default(100)
};
export const handler = async (params: { path: string; show_hidden: boolean; max_items: number }) => {
  try {
    const fs = await import("fs");
    const path = await import("path");
    
    const resolvedPath = path.resolve(params.path);
    
    // Allow listing any accessible directory
    if (!fs.existsSync(resolvedPath)) {
      return {
        content: [{ type: "text", text: `Error: Directory does not exist: ${params.path}` }]
      };
    }
    
    const stat = fs.statSync(resolvedPath);
    if (!stat.isDirectory()) {
      return {
        content: [{ type: "text", text: `Error: Path is not a directory: ${params.path}` }]
      };
    }
    
    const items = fs.readdirSync(resolvedPath).filter(item => {
      if (!params.show_hidden && item.startsWith('.')) {
        return false;
      }
      return true;
    });
    
    // Limit number of items returned
    const limitedItems = items.slice(0, params.max_items);
    
    let response = `Contents of directory "${params.path}":\n`;
    
    for (const item of limitedItems) {
      const itemPath = path.join(resolvedPath, item);
      const itemStat = fs.statSync(itemPath);
      const type = itemStat.isDirectory() ? "[DIR]" : "[FILE]";
      const size = itemStat.isDirectory() ? "" : ` (${itemStat.size} bytes)`;
      response += `${type} ${item}${size}\n`;
    }
    
    if (items.length > params.max_items) {
      response += `\n... and ${items.length - params.max_items} more items`;
    }
    
    return {
      content: [{ type: "text", text: response }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error listing directory: ${(error as Error).message}` }]
    };
  }
};