import { z } from "zod";

export const name = "file_delete";
export const description = "Delete a specified file";
export const parameters = {
  path: z.string().describe("The path to the file to delete")
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
    
    const stat = fs.statSync(resolvedPath);
    if (stat.isDirectory()) {
      return {
        content: [{ type: "text", text: `Error: Path is a directory, not a file: ${params.path}` }]
      };
    }
    
    // Delete the file
    fs.unlinkSync(resolvedPath);
    
    return {
      content: [{ type: "text", text: `Successfully deleted file: ${params.path}` }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error deleting file: ${(error as Error).message}` }]
    };
  }
};