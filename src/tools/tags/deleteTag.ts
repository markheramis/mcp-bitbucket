import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the delete tag tool.
 * Removes a git tag from a repository by name.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerDeleteTagTool(server: McpServer): void {
  server.tool(
    "bitbucket_delete_tag",
    {
      ...RepositorySchema.shape,
      name: z.string().describe('Tag name to delete (e.g. "v1.0.0")')
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
        const response = await client.repositories.deleteTag({
          workspace,
          repo_slug: repository,
          name
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
