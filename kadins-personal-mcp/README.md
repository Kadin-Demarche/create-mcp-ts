# Kadins Personal MCP Server

Kadin's Personal Model Context Protocol (MCP) Server with comprehensive file system and command tools.

## Overview

This MCP server provides a wide range of tools to interact with your system, including:
- File system operations (search, read, write, copy, move, delete, etc.)
- Command execution capabilities
- System information tools
- And more!

## Installation

```bash
npm install -g kadins-personal-mcp
```

## Usage

To start the MCP server:

```bash
kadins-personal-mcp
```

Or for development:

```bash
npm run dev
```

## Available Tools

### File System Tools
- `file_search`: Search for files by name or content
- `file_write`: Write content to a file
- `file_list`: List files in a directory
- `file_delete`: Delete a specified file
- `file_copy`: Copy a file from one location to another
- `file_move`: Move or rename a file
- `file_permissions`: Change file permissions
- `directory_create`: Create a new directory
- `directory_list`: List directory contents with details
- `directory_tree`: Generate a tree diagram of a directory structure
- `file_edit`: Edit file content by replacing specific text
- `file_glob`: Find files using glob patterns
- `list_files`: List files and subdirectories in a directory
- `write_file`: Create or overwrite a file with specified content

### System Tools
- `run_command`: Execute shell commands on the system
- `shell_command`: Execute shell commands with more options
- `read_file`: Read the contents of a file
- `read_many_files`: Read content from multiple files
- `text_search`: Search for text patterns within files using grep

### Network Tools
- `web_fetch`: Fetch content from a specified URL

## Configuration

The server can be configured to work with various MCP-compatible clients like Cursor, Claude Desktop, and Windsurf.

### For Local Installation (Recommended for Development)

Since you've installed the package globally with `npm install -g .`, the MCP client can directly execute the command. Add the following entry to your MCP configuration file:

```json
{
  "mcpServers": {
    "kadins-personal-mcp": {
      "command": "kadins-personal-mcp",
      "args": []
    }
  }
}
```

### For Direct Path Installation

If the above doesn't work, you can also configure it to run directly with node:

```json
{
  "mcpServers": {
    "kadins-personal-mcp": {
      "command": "node",
      "args": ["/Users/kadin/.nvm/versions/node/v22.21.1/lib/node_modules/kadins-personal-mcp/dist/index.js"]
    }
  }
}
```

Replace the path with the actual path to the installed package. You can find the correct path by running:
```bash
npm list -g --depth=0 kadins-personal-mcp
```

For Claude Desktop, the configuration file is typically located at:
`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS

For Cursor, the configuration file is typically located at:
`~/.cursor/mcp.json`

For Windsurf, the configuration file is typically located at:
`~/.codeium/windsurf/mcp_config.json`

## Security

This server includes security measures to prevent path traversal and other potential security issues. However, please be cautious when using tools that execute commands or modify files.

## Development

To build the server:

```bash
npm run build
```

To run tests:

```bash
npm run test
```

## System Prompt

For AI models to properly understand and use these tools, refer to the SYSTEM_PROMPT.md file which contains a comprehensive system prompt explaining all available tools and their usage.

For integration with existing AI systems, see INTEGRATED_SYSTEM_PROMPT.md which combines the Kadins Personal MCP tools information with a standard AI system prompt template.

## License

MIT