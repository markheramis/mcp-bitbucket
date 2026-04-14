import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { PullRequestParamsSchema } from '../../schemas.js';

/**
 * Register the pull request task listing tool.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerListPullRequestTasksTool(server: McpServer): void {
  server.tool(
    "bitbucket_list_pull_request_tasks",
    PullRequestParamsSchema.shape,
    async ({ workspace, repository, prId }: { workspace: string; repository: string; prId: number }) => {
      try {
        const response = await client.pullrequests.listTasks({
          workspace,
          repo_slug: repository,
          pull_request_id: prId
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
