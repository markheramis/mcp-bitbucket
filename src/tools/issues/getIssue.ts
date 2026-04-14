import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the get issue tool.
 * Fetches details for a single issue by its numeric ID.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerGetIssueTool(server: McpServer): void {
  server.tool(
    "bitbucket_get_issue",
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
        const response = await client.repositories.getIssue({
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
