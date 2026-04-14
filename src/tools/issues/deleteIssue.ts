import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the delete issue tool.
 * Permanently removes an issue from the repository's issue tracker.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerDeleteIssueTool(server: McpServer): void {
  server.tool(
    "bitbucket_delete_issue",
    {
      ...RepositorySchema.shape,
      issueId: z.string().describe('Issue ID to delete')
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
        const response = await client.repositories.deleteIssue({
          workspace,
          repo_slug: repository,
          issue_id: issueId
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
