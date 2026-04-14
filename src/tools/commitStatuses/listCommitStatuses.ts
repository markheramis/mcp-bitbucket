import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the list commit statuses tool.
 * Returns all build and CI/CD statuses associated with a specific commit.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerListCommitStatusesTool(server: McpServer): void {
  server.tool(
    "bitbucket_list_commit_statuses",
    {
      ...RepositorySchema.shape,
      commit: z.string().describe('Commit hash')
    },
    async ({
      workspace,
      repository,
      commit
    }: {
      workspace: string;
      repository: string;
      commit: string;
    }) => {
      try {
        const response = await client.repositories.listCommitStatuses({
          workspace,
          repo_slug: repository,
          commit
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
