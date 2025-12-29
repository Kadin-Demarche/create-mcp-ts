# mcp-ts-template-default

Default project template for `create-mcp-ts`.

## File-Based Tool System

This template includes a dynamic file-based tool system that allows you to create new MCP tools by simply adding files to the `tools/` directory.

### Creating New Tools

To create a new tool, add a TypeScript file to the `tools/` directory that exports the following:

- `name`: A string identifier for the tool
- `description`: A description of what the tool does
- `parameters`: An object defining the tool's parameters using Zod schemas
- `handler`: An async function that implements the tool's functionality

### Example Tool

```typescript
// tools/helloWorld.ts
import { z } from "zod";

export const name = "hello_world";
export const description = "A simple hello world tool";
export const parameters = {
  name: z.string().describe("The name to greet")
};
export const handler = async (params: { name: string }) => {
  return {
    content: [{ type: "text", text: `Hello, ${params.name}!` }]
  };
};
```

### Available Tools

This template includes several example tools in the `tools/` directory:

- `readFile.ts`: Reads the contents of a file
- `calculator.ts`: Performs basic mathematical calculations
- `currentTime.ts`: Gets the current date and time
- `echo.ts`: Echoes back a provided message
- `runCommand.ts`: Executes shell commands on the system
- `fileSearch.ts`: Searches for files by name or content
- `fileWrite.ts`: Writes content to a file
- `fileList.ts`: Lists files in a directory
- `fileDelete.ts`: Deletes a specified file
- `fileCopy.ts`: Copies a file from one location to another
- `fileMove.ts`: Moves or renames a file
- `filePermissions.ts`: Changes file permissions
- `directoryCreate.ts`: Creates a new directory
- `directoryList.ts`: Lists directory contents with details
- `directoryTree.ts`: Generates a tree diagram of a directory structure

## Related packages

- **[packages/create-mcp-ts](https://github.com/stephencme/create-mcp-ts/tree/main/packages/create-mcp-ts)**: Create a new MCP server in TypeScript, batteries included.
- **[packages/mcp-scripts](https://github.com/stephencme/create-mcp-ts/tree/main/packages/mcp-scripts)**: The build tools that power `create-mcp-ts` projects.
