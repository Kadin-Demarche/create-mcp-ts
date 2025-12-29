import { z } from "zod";

export const name = "text_search";
export const description = "Search for text patterns within files using grep";
export const parameters = {
  pattern: z.string().describe("The text pattern to search for (supports regex)"),
  path: z.string().describe("The file or directory path to search in").optional().default("."),
  case_sensitive: z.boolean().describe("Whether the search is case sensitive").optional().default(true)
};
export const handler = async (params: { pattern: string; path: string; case_sensitive: boolean }) => {
  try {
    const { exec } = await import("child_process");
    const util = await import("util");
    
    // Use util.promisify to convert exec to a promise-based function
    const execPromise = util.promisify(exec);
    
    // Build the grep command
    let command = "grep -r -n --color=never ";
    if (!params.case_sensitive) {
      command += "-i ";
    }
    command += `"${params.pattern}" "${params.path}"`;
    
    // Execute the command with a timeout for safety
    const { stdout, stderr } = await Promise.race([
      execPromise(command),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Search timed out after 15 seconds')), 15000)
      )
    ]);
    
    // Limit output size to prevent huge responses
    let output = stdout || stderr || `No matches found for pattern: ${params.pattern}`;
    if (output.length > 5000) { // Limit to 5000 characters
      output = output.substring(0, 5000) + '\n... (output truncated)';
    }
    
    return {
      content: [
        { type: "text", text: `Search results for pattern "${params.pattern}" in path "${params.path}":\n\n${output}` }
      ]
    };
  } catch (error) {
    // If grep command fails (e.g., no matches), return a friendly message
    if ((error as any).code === 1) {
      // Exit code 1 in grep means no matches found, which is not a real error
      return {
        content: [
          { type: "text", text: `No matches found for pattern: ${params.pattern}` }
        ]
      };
    }
    
    return {
      content: [
        { type: "text", text: `Error searching for pattern: ${(error as Error).message}` }
      ]
    };
  }
};