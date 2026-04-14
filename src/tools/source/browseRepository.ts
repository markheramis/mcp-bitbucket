import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the browse repository tool.
 * Lists the root-level directory tree of a repository at its default branch.
 * Useful for discovering available files and folders without knowing a specific commit.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerBrowseRepositoryTool(server: McpServer): void {
  server.tool(
    "bitbucket_browse_repository",
    RepositorySchema.shape,
    async ({ workspace, repository }: { workspace: string; repository: string }) => {
      try {
        const response = await client.repositories.readSrcRoot({
          workspace,
          repo_slug: repository
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
