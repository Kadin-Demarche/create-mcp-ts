import { z } from "zod";

export const name = "read_file";
export const description = "Read the contents of a file";
export const parameters = {
  path: z.string().describe("The path to the file to read")
};
export const handler = async (params: { path: string }) => {
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
    
    if (!fs.existsSync(resolvedPath)) {
      return {
        content: [{ type: "text", text: `Error: File does not exist: ${params.path}` }]
      };
    }
    
    const content = fs.readFileSync(resolvedPath, "utf-8");
    return {
      content: [{ type: "text", text: content }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error reading file: ${error.message}` }]
    };
  }
};