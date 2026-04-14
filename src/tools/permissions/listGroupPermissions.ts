import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the list group permissions tool.
 * Returns all explicit group permission entries for a repository.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerListGroupPermissionsTool(server: McpServer): void {
  server.tool(
    "bitbucket_list_group_permissions",
    RepositorySchema.shape,
    async ({ workspace, repository }: { workspace: string; repository: string }) => {
      try {
        const response = await client.repositories.listGroupPermissions({
          workspace,
          repo_slug: repository
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
