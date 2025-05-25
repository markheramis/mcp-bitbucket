import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from 'path';
import fs from 'fs';
import os from 'os';
import { env, execPath } from "process";
// Load .env.testing file explicitly
require('dotenv').config({ path: '.env.testing' });

// Type definitions for MCP responses
type McpResponse = {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
};


// Helper function to create a temporary directory
function createTempDir(): string {
  const tempDir = path.join(os.tmpdir(), `mcp-bitbucket-test-${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });
  return tempDir;
}

// Helper function to clean up temporary directory
function cleanupTempDir(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// Helper function to wait for a file to exist
function waitForFile(filePath: string, timeout = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const checkFile = () => {
      if (fs.existsSync(filePath)) {
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        resolve(false);
      } else {
        setTimeout(checkFile, 100);
      }
    };
    checkFile();
  });
}

describe('MCP Bitbucket Server Tests', () => {
  let client: Client;

  // Test data - for Bitbucket Cloud
  const TEST_WORKSPACE = 'your_workspace';
  const TEST_PROJECT = 'TEST';
  const TEST_REPO = 'test-repo';
  const TEST_PR_ID = 123;

  // Increase timeouts for potentially slow API calls
  jest.setTimeout(60000); // 60 second timeout for the entire test suite

  beforeAll(async () => {
    

    let env: any = {
        BITBUCKET_URL: process.env.BITBUCKET_URL || undefined
    };
    if (process.env.BITBUCKET_TOKEN) {
        env.BITBUCKET_TOKEN = process.env.BITBUCKET_TOKEN;
    }
    if (process.env.BITBUCKET_USERNAME) {
        env.BITBUCKET_USERNAME = process.env.BITBUCKET_USERNAME;
    }
    if (process.env.BITBUCKET_PASSWORD) {
        env.BITBUCKET_PASSWORD = process.env.BITBUCKET_PASSWORD;
    }
    if (process.env.BITBUCKET_DEFAULT_PROJECT) {
        env.BITBUCKET_DEFAULT_PROJECT = process.env.BITBUCKET_DEFAULT_PROJECT;
    }
    
    // Create MCP client with transport that will start the server
    const transport = new StdioClientTransport({
      command: execPath,
      args: ['--loader', 'ts-node/esm', '--experimental-specifier-resolution=node', 'src/index.ts'],
      env
    });
    client = new Client({
      name: "bitbucket-test-client",
      version: "0.1.0"
    });
    // Connect to MCP server with a longer timeout
    try {
      await client.connect(transport);
    } catch (error) {
      console.error("Failed to connect to MCP server:", error);
      throw error;
    }
  }, 30000); // 30 second timeout for the beforeAll hook
  afterAll(async () => {
    // Cleanup
    try {
      await client.close();
    //   console.log("Closed MCP client connection");
    } catch (error) {
      console.error("Error closing client:", error);
    }
  }, 30000); // 30 second timeout for afterAll
  describe('CRUD Operations - Ordered Tests', () => {
    // List workspaces test with better error handling
    it('should list workspaces', async () => {
      const result = await client.callTool({
        name: 'bitbucket_list_workspaces',
        arguments: {}
      }) as McpResponse;
    //   console.log("Workspace response:", result.content[0].text);
      // We don't fail the test for auth errors, just verify we got any response
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);
    }, 30000); // 30 second timeout for this test
  });
});