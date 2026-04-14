import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { WorkspaceSchema } from '../../schemas.js';

/**
 * Register the list snippets tool.
 * Returns all snippets for a workspace. Snippets are standalone code fragments
 * hosted on Bitbucket.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerListSnippetsTool(server: McpServer): void {
  server.tool(
    "bitbucket_list_snippets",
    {
      ...WorkspaceSchema.shape,
      role: z.enum(['owner', 'contributor', 'member']).optional().describe('Filter by role (owner, contributor, member)')
    },
    async ({
      workspace,
      role
    }: {
      workspace: string;
      role?: 'owner' | 'contributor' | 'member';
    }) => {
      try {
        const response = await client.snippets.listForUser({
          workspace,
          role
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
