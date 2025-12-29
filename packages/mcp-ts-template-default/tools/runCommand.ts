import { z } from "zod";

export const name = "run_command";
export const description = "Execute a shell command on the system";
export const parameters = {
  command: z.string().describe("The shell command to execute")
};
export const handler = async (params: { command: string }) => {
  try {
    // Dynamically import child_process
    const { exec } = await import("child_process");
    const util = await import("util");
    
    // Use util.promisify to convert exec to a promise-based function
    const execPromise = util.promisify(exec);
    
    // Execute the command with a timeout for safety
    const { stdout, stderr } = await Promise.race([
      execPromise(params.command),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Command timed out after 10 seconds')), 10000)
      )
    ]);
    
    // Return both stdout and stderr
    return {
      content: [
        { type: "text", text: `Command: ${params.command}\n\nOutput:\n${stdout || stderr || 'Command executed successfully with no output'}` }
      ]
    };
  } catch (error) {
    return {
      content: [
        { type: "text", text: `Error executing command: ${params.command}\n\nError: ${(error as Error).message}` }
      ]
    };
  }
};