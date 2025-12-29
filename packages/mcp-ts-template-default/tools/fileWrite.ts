import { z } from "zod";

export const name = "file_write";
export const description = "Write content to a file (with safety checks to prevent overwrites)";
export const parameters = {
  path: z.string().describe("The path to the file to write"),
  content: z.string().describe("The content to write to the file"),
  overwrite: z.boolean().describe("Whether to overwrite an existing file").optional().default(false)
};
export const handler = async (params: { path: string; content: string; overwrite: boolean }) => {
  try {
    const fs = await import("fs");
    const path = await import("path");
    
    // Resolve the path relative to the current working directory
    const resolvedPath = path.resolve(params.path);
    
    // Check if the path is within the current working directory to prevent path traversal
    const cwd = process.cwd();
    if (!resolvedPath.startsWith(cwd)) {
      return {
        content: [{ type: "text", text: "Error: Path traversal is not allowed" }]
      };
    }
    
    // Check if file exists and overwrite is not allowed
    if (fs.existsSync(resolvedPath) && !params.overwrite) {
      return {
        content: [{ type: "text", text: `Error: File already exists at ${params.path}. Use overwrite=true to overwrite.` }]
      };
    }
    
    // Create directory if it doesn't exist
    const dir = path.dirname(resolvedPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the content to the file
    fs.writeFileSync(resolvedPath, params.content, "utf-8");
    
    return {
      content: [{ type: "text", text: `Successfully wrote ${params.content.length} characters to ${params.path}` }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error writing file: ${(error as Error).message}` }]
    };
  }
};