import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the list webhooks tool.
 * Returns all webhook subscriptions configured on a repository.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerListWebhooksTool(server: McpServer): void {
  server.tool(
    "bitbucket_list_webhooks",
    RepositorySchema.shape,
    async ({ workspace, repository }: { workspace: string; repository: string }) => {
      try {
        const response = await client.repositories.listWebhooks({
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
