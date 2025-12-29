import { z } from "zod";

export const name = "directory_create";
export const description = "Create a new directory";
export const parameters = {
  path: z.string().describe("The path to the directory to create"),
  recursive: z.boolean().describe("Whether to create parent directories if they don't exist").optional().default(true)
};
export const handler = async (params: { path: string; recursive: boolean }) => {
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
    
    // Check if directory already exists
    if (fs.existsSync(resolvedPath)) {
      return {
        content: [{ type: "text", text: `Error: Directory already exists: ${params.path}` }]
      };
    }
    
    // Create the directory
    fs.mkdirSync(resolvedPath, { recursive: params.recursive });
    
    return {
      content: [{ type: "text", text: `Successfully created directory: ${params.path}` }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error creating directory: ${(error as Error).message}` }]
    };
  }
};