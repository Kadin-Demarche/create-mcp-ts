import { z } from "zod";

export const name = "shell_command";
export const description = "Execute shell commands on the system";
export const parameters = {
  command: z.string().describe("The shell command to execute"),
  timeout: z.number().describe("Command timeout in seconds").optional().default(30)
};
export const handler = async (params: { command: string; timeout: number }) => {
  try {
    // Dynamically import child_process
    const { exec } = await import("child_process");
    const util = await import("util");

    // Use util.promisify to convert exec to a promise-based function
    const execPromise = util.promisify(exec);

    // Validate command to prevent potentially dangerous operations
    const dangerousCommands = ['rm -rf /', 'dd', 'mkfs', 'format', '>:', '>/dev/null'];
    for (const dangerousCmd of dangerousCommands) {
      if (params.command.toLowerCase().includes(dangerousCmd)) {
        return {
          content: [
            { type: "text", text: `Error: Command contains potentially dangerous operation: ${dangerousCmd}` }
          ]
        };
      }
    }

    // Execute the command with a timeout for safety
    const { stdout, stderr } = await Promise.race([
      execPromise(params.command),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Command timed out after ${params.timeout} seconds`)), params.timeout * 1000)
      )
    ]);

    // Limit output size to prevent huge responses
    let output = stdout || stderr || 'Command executed successfully with no output';
    if (output.length > 5000) { // Limit to 5000 characters
      output = output.substring(0, 5000) + '\n... (output truncated)';
    }

    // Return both stdout and stderr
    return {
      content: [
        { type: "text", text: `Command: ${params.command}\n\nOutput:\n${output}` }
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