#!/usr/bin/env node
import 'dotenv/config';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Import the centralized tool registration function
import { registerAllTools } from "./tools/registerTools.js";

// Create MCP server
const server = new McpServer({
  name: "bitbucket-server",
  version: "1.0.0"
});

// Register all tools with the server
registerAllTools(server);

// Start server
async function runServer() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("Bitbucket MCP server running on stdio");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server immediately
runServer();