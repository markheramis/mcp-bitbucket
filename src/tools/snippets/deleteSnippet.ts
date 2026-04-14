import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { WorkspaceSchema } from '../../schemas.js';

/**
 * Register the delete snippet tool.
 * Permanently removes a snippet from Bitbucket.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerDeleteSnippetTool(server: McpServer): void {
  server.tool(
    "bitbucket_delete_snippet",
    {
      ...WorkspaceSchema.shape,
      encodedId: z.string().describe('Snippet encoded ID to delete')
    },
    async ({
      workspace,
      encodedId
    }: {
      workspace: string;
      encodedId: string;
    }) => {
      try {
        const response = await client.snippets.delete({
          workspace,
          encoded_id: encodedId
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
