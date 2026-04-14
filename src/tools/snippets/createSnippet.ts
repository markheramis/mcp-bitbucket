import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';

/**
 * Register the create snippet tool.
 * Creates a new code snippet on Bitbucket. Snippets are standalone code fragments
 * that can be shared or used as gists.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerCreateSnippetTool(server: McpServer): void {
  server.tool(
    "bitbucket_create_snippet",
    {
      title: z.string().describe('Snippet title'),
      isPrivate: z.boolean().optional().describe('Whether the snippet is private (default: false)')
    },
    async ({
      title,
      isPrivate
    }: {
      title: string;
      isPrivate?: boolean;
    }) => {
      try {
        const response = await client.snippets.create({
          _body: {
            type: 'snippet',
            title,
            is_private: isPrivate ?? false,
            scm: 'git'
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
