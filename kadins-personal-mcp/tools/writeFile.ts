import { z } from "zod";

export const name = "write_file";
export const description = "Create or overwrite a file with specified content";
export const parameters = {
  file_path: z.string().describe("The absolute path to the file to write"),
  content: z.string().describe("The content to write to the file"),
  create_directories: z.boolean().describe("Whether to create parent directories if they don't exist").optional().default(true)
};
export const handler = async (params: { file_path: string; content: string; create_directories: boolean }) => {
  try {
    const fs = await import("fs");
    const path = await import("path");
    
    // Resolve the path relative to the current working directory
    const resolvedPath = path.resolve(params.file_path);
    
    // Allow writing to any accessible path
    if (params.create_directories) {
      // Create parent directories if they don't exist
      const dir = path.dirname(resolvedPath);
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the content to the file
    fs.writeFileSync(resolvedPath, params.content, "utf-8");
    
    return {
      content: [{ type: "text", text: `Successfully wrote ${params.content.length} characters to ${params.file_path}` }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error writing file: ${(error as Error).message}` }]
    };
  }
};