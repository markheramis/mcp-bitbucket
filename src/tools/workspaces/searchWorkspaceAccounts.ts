import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { WorkspaceSchema } from '../../schemas.js';

/**
 * Register workspace account search tools, including the legacy misspelled
 * alias kept for backward compatibility.
 * @param server The MCP server instance that exposes the tools.
 * @returns Nothing.
 */
export function registerSearchWorkspaceAccountsTool(server: McpServer) {
  const searchSchema = {
    ...WorkspaceSchema.shape,
    query: z.string().describe('Search query for filtering accounts')
  };

  /**
   * Reuse the same registration logic for both tool names so older clients keep
   * working while new clients can use the corrected spelling.
   */
  const registerSearchTool = (toolName: string): void => {
    server.tool(
      toolName,
      searchSchema,
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
  };

  registerSearchTool("bitbuicket_search_workspace_accounts");
  registerSearchTool("bitbucket_search_workspace_accounts");
}
