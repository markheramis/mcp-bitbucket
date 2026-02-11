import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { WorkspaceSchema } from '../../schemas.js';

export function registerSearchWorkspaceAccountsTool(server: McpServer) {
  server.tool(
    "bitbuicket_search_workspace_accounts",
    {
      ...WorkspaceSchema.shape,
      query: z.string().describe('Search query for filtering accounts')
    },
    async ({ workspace, query }: { workspace: string; query: string }) => {
      try {
        const response = await client.workspaces.searchAccount({
          workspace,
          search_query: query
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