import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the create webhook tool.
 * Subscribes a URL to receive webhook events from a repository.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerCreateWebhookTool(server: McpServer): void {
  server.tool(
    "bitbucket_create_webhook",
    {
      ...RepositorySchema.shape,
      url: z.string().url().describe('Target URL that will receive the webhook POST requests'),
      description: z.string().optional().describe('Human-readable description of the webhook'),
      active: z.boolean().optional().describe('Whether the webhook is active (default: true)'),
      events: z.array(z.string()).describe(
        'List of events to subscribe to (e.g. ["repo:push", "pullrequest:created", "pullrequest:fulfilled"])'
      )
    },
    async ({
      workspace,
      repository,
      url,
      description,
      active,
      events
    }: {
      workspace: string;
      repository: string;
      url: string;
      description?: string;
      active?: boolean;
      events: string[];
    }) => {
      try {
        const response = await client.repositories.createWebhook({
          workspace,
          repo_slug: repository,
          _body: {
            url,
            description,
            active: active ?? true,
            events
          }
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
