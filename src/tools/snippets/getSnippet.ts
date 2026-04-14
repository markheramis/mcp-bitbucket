import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { WorkspaceSchema } from '../../schemas.js';

/**
 * Register the get snippet tool.
 * Fetches a snippet by its encoded ID within a workspace.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerGetSnippetTool(server: McpServer): void {
  server.tool(
    "bitbucket_get_snippet",
    {
      ...WorkspaceSchema.shape,
      encodedId: z.string().describe('Snippet encoded ID')
    },
    async ({
      workspace,
      encodedId
    }: {
      workspace: string;
      encodedId: string;
    }) => {
      try {
        const response = await client.snippets.get({
          workspace,
          encoded_id: encodedId
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
