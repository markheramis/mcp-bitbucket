import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { WorkspaceSchema } from '../../schemas.js';

export function registerListWorkspaceMembersTool(server: McpServer) {
  server.tool(
    "bitbucket_list_workspace_members",
    WorkspaceSchema.shape,
    async ({ workspace }: { workspace: string }) => {
      try {
        // Use the correct method from the Bitbucket API
        const response = await client.workspaces.getMembersForWorkspace({
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