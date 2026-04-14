import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { WorkspaceSchema } from '../../schemas.js';

/**
 * Register the update snippet tool.
 * Updates a snippet's title or visibility. Uses PUT semantics (full replacement).
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerUpdateSnippetTool(server: McpServer): void {
  server.tool(
    "bitbucket_update_snippet",
    {
      ...WorkspaceSchema.shape,
      encodedId: z.string().describe('Snippet encoded ID to update'),
      title: z.string().optional().describe('New snippet title'),
      isPrivate: z.boolean().optional().describe('Whether the snippet should be private')
    },
    async ({
      workspace,
      encodedId,
      title,
      isPrivate
    }: {
      workspace: string;
      encodedId: string;
      title?: string;
      isPrivate?: boolean;
    }) => {
      try {
        const body: any = {};
        if (title !== undefined) body.title = title;
        if (isPrivate !== undefined) body.is_private = isPrivate;

        // The SDK's SnippetsUpdate type does not expose _body; cast to any to pass the body.
        const response = await (client.snippets.update as any)({
          workspace,
          encoded_id: encodedId,
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
