import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { PullRequestParamsSchema } from '../../schemas.js';

/**
 * Register the pull request unapproval tool.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerUnapprovePullRequestTool(server: McpServer): void {
  server.tool(
    "bitbucket_unapprove_pull_request",
    PullRequestParamsSchema.shape,
    async ({ workspace, repository, prId }: { workspace: string; repository: string; prId: number }) => {
      try {
        const response = await client.pullrequests.deleteApproval({
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
