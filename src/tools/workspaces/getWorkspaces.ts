import * as winston from 'winston';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';

export function registerWorkspacesTool(server: McpServer) {
  server.tool(
    "bitbucket_list_workspaces",
    {},
    async () => {
      try {
        // First try to get workspaces using the correct method
        try {
          const workspacesResponse = await client.workspaces.getWorkspaces({});
          
          return {
            content: [{ 
              type: "text", 
              text: JSON.stringify({
                message: "Successfully retrieved workspaces",
                workspaces: workspacesResponse.data
              }, null, 2) 
            }]
          };
        } catch (authError: any) {
          // Authentication failed
          logger.error('Authentication error', { error: authError });
          
          return {
            content: [{ 
              type: "text", 
              text: JSON.stringify({
                error: "Authentication failed",
                message: authError.message,
                hint: "Please check your Bitbucket credentials in the .env and .env.testing files",
                requirements: {
                  ".env or MCP env": "Set BITBUCKET_EMAIL and BITBUCKET_TOKEN (same Atlassian API token as Jira/Confluence)",
                  "BITBUCKET_BASE_URL": "https://api.bitbucket.org/2.0 for Bitbucket Cloud or your server URL",
                  "Legacy": "BITBUCKET_USERNAME and BITBUCKET_PASSWORD are still supported"
                },
                example_workspaces: [
                  {
                    "name": "Example Workspace",
                    "slug": "example-workspace",
                    "description": "This is just an example - please provide real credentials in your .env file"
                  }
                ]
              }, null, 2) 
            }]
          };
        }
      } catch (error: any) {
        // General error handling
        logger.error('Tool execution error', { error });
        
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify({
              error: "Error executing tool",
              message: error.message || String(error),
              stack: error.stack
            }, null, 2) 
          }],
          isError: true
        };
      }
    }
  );
} 