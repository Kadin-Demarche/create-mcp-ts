import { z } from "zod";

export const name = "file_glob";
export const description = "Find files using glob patterns";
export const parameters = {
  pattern: z.string().describe("The glob pattern to match files against (e.g., '**/*.js', '*.ts')")
};
export const handler = async (params: { pattern: string }) => {
  try {
    const { glob } = await import("glob");
    
    // Execute the glob pattern to find matching files
    const files = await new Promise<string[]>((resolve, reject) => {
      glob(params.pattern, (err, matches) => {
        if (err) {
          reject(err);
        } else {
          resolve(matches);
        }
      });
    });
    
    if (files.length === 0) {
      return {
        content: [{ type: "text", text: `No files found matching pattern: ${params.pattern}` }]
      };
    }
    
    // Limit results to prevent huge responses
    const limitedFiles = files.slice(0, 100); // Limit to first 100 files
    let response = `Found ${files.length} file(s) matching pattern "${params.pattern}":\n${limitedFiles.join("\n")}`;
    
    if (files.length > 100) {
      response += `\n\n... and ${files.length - 100} more files`;
    }
    
    return {
      content: [{ type: "text", text: response }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error finding files with glob pattern: ${(error as Error).message}` }]
    };
  }
};