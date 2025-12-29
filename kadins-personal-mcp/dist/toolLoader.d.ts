import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

declare function loadTools(server: McpServer): Promise<void>;

export { loadTools };
