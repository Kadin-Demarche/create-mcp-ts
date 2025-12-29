import { z } from "zod";

export const name = "directory_tree";
export const description = "Generate a tree diagram of a directory structure";
export const parameters = {
  directory: z.string().describe("The directory to generate a tree diagram for").optional().default("."),
  maxDepth: z.number().describe("Maximum depth to traverse").optional().default(3),
  showHidden: z.boolean().describe("Whether to show hidden files/directories").optional().default(false)
};
export const handler = async (params: { directory: string; maxDepth: number; showHidden: boolean }) => {
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
    
    function buildTree(dir: string, prefix: string = "", depth: number = 0): string {
      if (depth >= params.maxDepth) {
        return "";
      }
      
      const items = fs.readdirSync(dir).filter(item => {
        if (!params.showHidden && item.startsWith('.')) {
          return false;
        }
        return true;
      }).sort();
      
      let tree = "";
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemPath = path.join(dir, item);
        const isLast = i === items.length - 1;
        const connector = isLast ? "└── " : "├── ";
        
        const stat = fs.statSync(itemPath);
        const itemType = stat.isDirectory() ? "/" : "";
        
        tree += `${prefix}${connector}${item}${itemType}\n`;
        
        if (stat.isDirectory()) {
          const newPrefix = prefix + (isLast ? "    " : "│   ");
          tree += buildTree(itemPath, newPrefix, depth + 1);
        }
      }
      
      return tree;
    }
    
    const treeDiagram = buildTree(resolvedDir);
    
    return {
      content: [{ type: "text", text: `Directory tree for ${params.directory || "."}:\n\n${treeDiagram}` }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating directory tree: ${(error as Error).message}` }]
    };
  }
};