import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the get tag tool.
 * Fetches details for a single git tag by its name.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerGetTagTool(server: McpServer): void {
  server.tool(
    "bitbucket_get_tag",
    {
      ...RepositorySchema.shape,
      name: z.string().describe('Tag name (e.g. "v1.0.0")')
    },
    async ({
      workspace,
      repository,
      name
    }: {
      workspace: string;
      repository: string;
      name: string;
    }) => {
      try {
        const response = await client.repositories.getTag({
          workspace,
          repo_slug: repository,
          name
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
