import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the list pipelines tool.
 * Returns all pipelines (CI/CD runs) for a repository, sorted by most recent first.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerListPipelinesTool(server: McpServer): void {
  server.tool(
    "bitbucket_list_pipelines",
    RepositorySchema.shape,
    async ({ workspace, repository }: { workspace: string; repository: string }) => {
      try {
        const response = await client.repositories.listPipelines({
          workspace,
          repo_slug: repository,
          sort: '-created_on'
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
