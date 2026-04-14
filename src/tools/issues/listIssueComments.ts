import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the list issue comments tool.
 * Returns all comments posted on a specific issue.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerListIssueCommentsTool(server: McpServer): void {
  server.tool(
    "bitbucket_list_issue_comments",
    {
      ...RepositorySchema.shape,
      issueId: z.string().describe('Issue ID')
    },
    async ({
      workspace,
      repository,
      issueId
    }: {
      workspace: string;
      repository: string;
      issueId: string;
    }) => {
      try {
        const response = await client.repositories.listIssueComments({
          workspace,
          repo_slug: repository,
          issue_id: issueId
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
