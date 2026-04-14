import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the update webhook tool.
 * Updates an existing webhook subscription's URL, events, or active state.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerUpdateWebhookTool(server: McpServer): void {
  server.tool(
    "bitbucket_update_webhook",
    {
      ...RepositorySchema.shape,
      uid: z.string().describe('Webhook UID to update'),
      url: z.string().url().optional().describe('New target URL for the webhook'),
      description: z.string().optional().describe('Updated description'),
      active: z.boolean().optional().describe('Whether the webhook should be active'),
      events: z.array(z.string()).optional().describe('Updated list of events to subscribe to')
    },
    async ({
      workspace,
      repository,
      uid,
      url,
      description,
      active,
      events
    }: {
      workspace: string;
      repository: string;
      uid: string;
      url?: string;
      description?: string;
      active?: boolean;
      events?: string[];
    }) => {
      try {
        const body: any = {};
        if (url !== undefined) body.url = url;
        if (description !== undefined) body.description = description;
        if (active !== undefined) body.active = active;
        if (events !== undefined) body.events = events;

        // The SDK's RepositoriesUpdateWebhook type does not expose _body; cast to any to pass the body.
        const response = await (client.repositories.updateWebhook as any)({
          workspace,
          repo_slug: repository,
          uid,
          _body: body
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
