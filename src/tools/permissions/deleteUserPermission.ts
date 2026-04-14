import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the delete user permission tool.
 * Removes a user's explicit permission entry from a repository,
 * reverting them to their inherited workspace-level access.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerDeleteUserPermissionTool(server: McpServer): void {
  server.tool(
    "bitbucket_delete_user_permission",
    {
      ...RepositorySchema.shape,
      selectedUserId: z.string().describe('Account ID or username of the user whose permission to remove')
    },
    async ({
      workspace,
      repository,
      selectedUserId
    }: {
      workspace: string;
      repository: string;
      selectedUserId: string;
    }) => {
      try {
        const response = await client.repositories.deleteUserPermission({
          workspace,
          repo_slug: repository,
          selected_user_id: selectedUserId
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data ?? { success: true }, null, 2) }]
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
