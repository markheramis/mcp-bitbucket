import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the delete webhook tool.
 * Removes a webhook subscription from a repository.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerDeleteWebhookTool(server: McpServer): void {
  server.tool(
    "bitbucket_delete_webhook",
    {
      ...RepositorySchema.shape,
      uid: z.string().describe('Webhook UID to delete')
    },
    async ({
      workspace,
      repository,
      uid
    }: {
      workspace: string;
      repository: string;
      uid: string;
    }) => {
      try {
        const response = await client.repositories.deleteWebhook({
          workspace,
          repo_slug: repository,
          uid
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
