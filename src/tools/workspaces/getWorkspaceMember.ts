import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { WorkspaceSchema } from '../../schemas.js';

export function registerGetWorkspaceMemberTool(server: McpServer) {
  server.tool(
    "bitbucket_get_workspace_member",
    {
      ...WorkspaceSchema.shape,
      member: z.string().describe('The member account ID or username')
    },
    async ({ workspace, member }: { workspace: string; member: string }) => {
      try {
        const response = await client.workspaces.getMemberForWorkspace({
          workspace,
          member
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