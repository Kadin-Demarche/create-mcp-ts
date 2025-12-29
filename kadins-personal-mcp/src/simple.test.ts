import { test } from '@jest/globals';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Simple test to verify the tool loader can be imported without errors
test('toolLoader can be imported', async () => {
  // We'll just check that the module can be imported without errors
  // Since the actual loading depends on the file system, we'll do a basic import test
  expect(typeof (await import('./toolLoader.js'))).toBe('object');
});