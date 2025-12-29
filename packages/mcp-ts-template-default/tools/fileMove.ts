import { z } from "zod";

export const name = "file_move";
export const description = "Move/rename a file";
export const parameters = {
  source: z.string().describe("The path to the source file"),
  destination: z.string().describe("The path to the destination file")
};
export const handler = async (params: { source: string; destination: string }) => {
  try {
    const fs = await import("fs");
    const path = await import("path");
    
    // Resolve paths relative to the current working directory
    const resolvedSource = path.resolve(params.source);
    const resolvedDestination = path.resolve(params.destination);
    
    // Check if paths are within the current working directory to prevent path traversal
    const cwd = process.cwd();
    if (!resolvedSource.startsWith(cwd) || !resolvedDestination.startsWith(cwd)) {
      return {
        content: [{ type: "text", text: "Error: Path traversal is not allowed" }]
      };
    }
    
    if (!fs.existsSync(resolvedSource)) {
      return {
        content: [{ type: "text", text: `Error: Source file does not exist: ${params.source}` }]
      };
    }
    
    if (fs.statSync(resolvedSource).isDirectory()) {
      return {
        content: [{ type: "text", text: `Error: Source path is a directory, not a file: ${params.source}` }]
      };
    }
    
    // Check if destination already exists
    if (fs.existsSync(resolvedDestination)) {
      return {
        content: [{ type: "text", text: `Error: Destination file already exists: ${params.destination}` }]
      };
    }
    
    // Create destination directory if it doesn't exist
    const destDir = path.dirname(resolvedDestination);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Move the file (rename it)
    fs.renameSync(resolvedSource, resolvedDestination);
    
    return {
      content: [{ type: "text", text: `Successfully moved file from ${params.source} to ${params.destination}` }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error moving file: ${(error as Error).message}` }]
    };
  }
};