import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the create issue comment tool.
 * Adds a new comment to an existing issue.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerCreateIssueCommentTool(server: McpServer): void {
  server.tool(
    "bitbucket_create_issue_comment",
    {
      ...RepositorySchema.shape,
      issueId: z.string().describe('Issue ID to comment on'),
      text: z.string().describe('Comment text (plain text or Markdown)')
    },
    async ({
      workspace,
      repository,
      issueId,
      text
    }: {
      workspace: string;
      repository: string;
      issueId: string;
      text: string;
    }) => {
      try {
        const response = await client.repositories.createIssueComment({
          workspace,
          repo_slug: repository,
          issue_id: issueId,
          _body: { type: 'issue_comment', content: { raw: text } }
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
