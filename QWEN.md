# Qwen Code Context: create-mcp-ts

## Project Overview

`create-mcp-ts` is a monorepo containing tools for creating Model Context Protocol (MCP) servers in TypeScript with zero configuration. It provides a batteries-included experience for developers to quickly set up, develop, and deploy MCP servers.

### Core Packages

1. **create-mcp-ts** - The main CLI tool that scaffolds new MCP server projects
2. **mcp-scripts** - Build tools and utilities for MCP server development (using tsup and esbuild)
3. **mcp-ts-template-default** - Default project template with basic MCP server implementation

### Architecture

This is a TypeScript monorepo using npm workspaces. The project follows a "create-*" pattern similar to create-react-app, providing a streamlined experience for MCP server development.

## Key Features

- **Zero Configuration**: No build setup required - everything is handled automatically
- **Batteries Included**: Includes all necessary dependencies and tools out of the box
- **Template Support**: Can use custom templates or the default template
- **MCP Client Setup**: Automatically configures MCP servers in Cursor, Windsurf, and Claude Desktop
- **Eject Capability**: Option to eject from mcp-scripts for custom configurations

## Building and Running

### Development Commands

```bash
# Build all packages in the monorepo
npm run build

# Publish all packages
npm run publish

# Version management
npm run version:patch    # For patch updates
npm run version:minor    # For minor updates
npm run version:major    # For major updates
```

### Using create-mcp-ts

```bash
# Create a new MCP server
npx create-mcp-ts your-server

# Navigate to project and start development
cd your-server
npm run dev

# Build for production
npm run build

# Set up in MCP clients
npm run setup

# Eject from mcp-scripts (if needed)
npm run eject
```

### Custom Templates

```bash
# Use a custom template
npx create-mcp-ts your-server --template=mcp-ts-template-default
npx create-mcp-ts your-server --template=file:/path/to/mcp-ts-template
```

## Package Details

### create-mcp-ts (CLI Tool)
- Creates new MCP server projects from templates
- Validates project names as valid npm package names
- Installs dependencies and initializes git repository
- Handles both npm package templates and local file templates

### mcp-scripts (Build Tools)
- Provides dev, build, setup, and eject commands
- Uses tsup for fast builds and bundling
- Handles MCP client configuration for Cursor, Windsurf, and Claude Desktop
- Supports ejecting to custom configurations

### mcp-ts-template-default (Template)
- Default template with basic MCP server implementation
- Uses @modelcontextprotocol/sdk for MCP functionality
- Includes sample tools: ping_pong and echo
- Configured with TypeScript and proper build settings

## Development Conventions

- TypeScript is used throughout the project
- ES modules are the default module system
- tsup is used for building and bundling
- Standard npm scripts for development workflows
- Git repository initialization and initial commit are handled automatically

## File Structure

```
create-mcp-ts/
├── package.json (monorepo root)
├── packages/
│   ├── create-mcp-ts/ (CLI tool)
│   ├── mcp-scripts/ (build tools)
│   └── mcp-ts-template-default/ (default template)
└── scripts/
    └── updateTemplatesDeps.cjs (dependency update script)
```

## MCP Server Template

The default template includes:
- Basic MCP server implementation using @modelcontextprotocol/sdk
- Two sample tools (ping_pong and echo)
- Proper TypeScript configuration
- Standard npm scripts (dev, build, setup, eject)
- MCP client setup capability