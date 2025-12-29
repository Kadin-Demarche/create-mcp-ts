# Publishing Kadins Personal MCP

## Prerequisites

1. Make sure you have an npm account at https://www.npmjs.com/
2. Ensure you're logged in to npm: `npm login`

## To Publish

1. Update the version in package.json if needed: `npm version patch` (or minor/major)
2. Run tests to make sure everything works: `npm test`
3. Build the project: `npm run build`
4. Publish to npm: `npm publish`

## Local Installation for Testing

To install locally for testing:

```bash
npm install -g .
```

Or to link for development:

```bash
npm link
```

## Verification

After publishing, you can install your package globally:

```bash
npm install -g kadins-personal-mcp
```

And then run it:

```bash
kadins-personal-mcp
```

The server will start and be available for MCP-compatible clients.