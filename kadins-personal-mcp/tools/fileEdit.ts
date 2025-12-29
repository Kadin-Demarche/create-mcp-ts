import { z } from "zod";

export const name = "file_edit";
export const description = "Edit the content of a file by replacing specific text segments";
export const parameters = {
  file_path: z.string().describe("The absolute path to the file to edit"),
  old_content: z.string().describe("The exact literal text to replace"),
  new_content: z.string().describe("The exact literal text to replace with"),
  replace_all: z.boolean().describe("Replace all occurrences of old_content (default false)").optional().default(false)
};
export const handler = async (params: { file_path: string; old_content: string; new_content: string; replace_all: boolean }) => {
  try {
    const fs = await import("fs");
    const path = await import("path");
    
    // Resolve the path relative to the current working directory
    const resolvedPath = path.resolve(params.file_path);
    
    // Allow editing any accessible file
    if (!fs.existsSync(resolvedPath)) {
      return {
        content: [{ type: "text", text: `Error: File does not exist: ${params.file_path}` }]
      };
    }
    
    const stat = fs.statSync(resolvedPath);
    if (stat.isDirectory()) {
      return {
        content: [{ type: "text", text: `Error: Path is a directory, not a file: ${params.file_path}` }]
      };
    }
    
    // Limit file size to prevent huge operations
    const maxSize = 1024 * 100; // 100KB limit
    if (stat.size > maxSize) {
      return {
        content: [{ type: "text", text: `Error: File is too large to edit (${Math.round(stat.size / 1024)}KB). Maximum allowed size is 100KB.` }]
      };
    }
    
    let content = fs.readFileSync(resolvedPath, "utf-8");
    
    // Perform the replacement
    let newFileContent;
    if (params.replace_all) {
      newFileContent = content.split(params.old_content).join(params.new_content);
    } else {
      // Only replace first occurrence
      const index = content.indexOf(params.old_content);
      if (index === -1) {
        return {
          content: [{ type: "text", text: `Error: The specified text to replace was not found in the file: ${params.file_path}` }]
        };
      }
      newFileContent = content.substring(0, index) + 
                      params.new_content + 
                      content.substring(index + params.old_content.length);
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(resolvedPath, newFileContent, "utf-8");
    
    return {
      content: [{ type: "text", text: `Successfully updated file: ${params.file_path}. Replaced ${params.replace_all ? 'all' : 'first'} occurrence(s) of specified text.` }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error editing file: ${(error as Error).message}` }]
    };
  }
};