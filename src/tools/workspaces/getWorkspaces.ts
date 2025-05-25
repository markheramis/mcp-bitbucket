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
                  ".env or .env.testing": "These files must contain your Bitbucket credentials",
                  "BITBUCKET_URL": "Should be set to https://api.bitbucket.org for Bitbucket Cloud or your server URL for Bitbucket Server",
                  "BITBUCKET_TOKEN": "A valid access token for the Bitbucket API",
                  "Alternative": "Instead of a token, you can provide BITBUCKET_USERNAME and BITBUCKET_PASSWORD"
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