import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the update group permission tool.
 * Sets or changes a group's explicit permission level on a repository.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerUpdateGroupPermissionTool(server: McpServer): void {
  server.tool(
    "bitbucket_update_group_permission",
    {
      ...RepositorySchema.shape,
      groupSlug: z.string().describe('Group slug'),
      permission: z.enum(['read', 'write', 'admin']).describe('Permission level to grant')
    },
    async ({
      workspace,
      repository,
      groupSlug,
      permission
    }: {
      workspace: string;
      repository: string;
      groupSlug: string;
      permission: 'read' | 'write' | 'admin';
    }) => {
      try {
        const response = await client.repositories.updateGroupPermission({
          workspace,
          repo_slug: repository,
          group_slug: groupSlug,
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
