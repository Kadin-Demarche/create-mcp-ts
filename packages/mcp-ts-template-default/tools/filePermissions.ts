import { z } from "zod";

export const name = "file_permissions";
export const description = "Change file permissions";
export const parameters = {
  path: z.string().describe("The path to the file"),
  permissions: z.string().describe("The new permissions in octal format (e.g., '755', '644')")
};
export const handler = async (params: { path: string; permissions: string }) => {
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
    
    // Validate permissions format (should be 3 or 4 digits)
    if (!/^[0-7]{3,4}$/.test(params.permissions)) {
      return {
        content: [{ type: "text", text: `Error: Invalid permissions format. Use octal format like '755' or '644'.` }]
      };
    }
    
    // Change file permissions
    const permissionsNum = parseInt(params.permissions, 8);
    fs.chmodSync(resolvedPath, permissionsNum);
    
    return {
      content: [{ type: "text", text: `Successfully changed permissions of ${params.path} to ${params.permissions}` }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error changing permissions: ${(error as Error).message}` }]
    };
  }
};