import { z } from "zod";

export const name = "read_many_files";
export const description = "Read content from multiple files specified by paths";
export const parameters = {
  paths: z.array(z.string()).describe("An array of file paths to read"),
  max_file_size: z.number().describe("Maximum file size to read in KB").optional().default(100)
};
export const handler = async (params: { paths: string[]; max_file_size: number }) => {
  try {
    const fs = await import("fs");
    const path = await import("path");
    
    let response = "";
    const maxSize = params.max_file_size * 1024; // Convert to bytes
    
    for (const filePath of params.paths) {
      const resolvedPath = path.resolve(filePath);
      
      if (!fs.existsSync(resolvedPath)) {
        response += `--- File not found: ${filePath} ---\n\n`;
        continue;
      }
      
      const stat = fs.statSync(resolvedPath);
      if (stat.isDirectory()) {
        response += `--- Path is a directory: ${filePath} ---\n\n`;
        continue;
      }
      
      if (stat.size > maxSize) {
        response += `--- File too large to read (${Math.round(stat.size / 1024)}KB): ${filePath} ---\n\n`;
        continue;
      }
      
      try {
        const content = fs.readFileSync(resolvedPath, "utf-8");
        response += `--- ${filePath} ---\n${content}\n--- End of ${filePath} ---\n\n`;
      } catch (error) {
        response += `--- Error reading file: ${filePath} - ${(error as Error).message} ---\n\n`;
      }
    }
    
    // Limit total response size
    if (response.length > 10000) { // Limit to 10KB
      response = response.substring(0, 10000) + '\n\n... (response truncated)';
    }
    
    return {
      content: [{ type: "text", text: response }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error reading files: ${(error as Error).message}` }]
    };
  }
};