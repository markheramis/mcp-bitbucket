import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { WorkspaceSchema } from '../../schemas.js';

export function registerListProjectsTool(server: McpServer) {
  server.tool(
    "bitbucket_list_projects",
    WorkspaceSchema.shape,
    async ({ workspace }) => {
      try {
        // Use the repositories.list method which works correctly
        const response = await client.repositories.list({
          workspace
        });
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        logger.error('Tool execution error', { error });
        
        return {
          content: [{ type: "text", text: `Error: ${error.message || String(error)}` }],
          isError: true
        };
      }
    }
  );
} 