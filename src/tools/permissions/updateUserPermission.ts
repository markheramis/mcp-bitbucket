import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the update user permission tool.
 * Sets or changes a user's explicit permission level on a repository.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerUpdateUserPermissionTool(server: McpServer): void {
  server.tool(
    "bitbucket_update_user_permission",
    {
      ...RepositorySchema.shape,
      selectedUserId: z.string().describe('Account ID or username of the user'),
      permission: z.enum(['read', 'write', 'admin']).describe('Permission level to grant')
    },
    async ({
      workspace,
      repository,
      selectedUserId,
      permission
    }: {
      workspace: string;
      repository: string;
      selectedUserId: string;
      permission: 'read' | 'write' | 'admin';
    }) => {
      try {
        const response = await client.repositories.updateUserPermission({
          workspace,
          repo_slug: repository,
          selected_user_id: selectedUserId,
          _body: { permission }
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
