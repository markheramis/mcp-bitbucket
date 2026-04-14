import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the delete report tool.
 * Removes a code insight report from a commit.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerDeleteReportTool(server: McpServer): void {
  server.tool(
    "bitbucket_delete_report",
    {
      ...RepositorySchema.shape,
      commit: z.string().describe('Commit hash'),
      reportId: z.string().describe('Report ID to delete')
    },
    async ({
      workspace,
      repository,
      commit,
      reportId
    }: {
      workspace: string;
      repository: string;
      commit: string;
      reportId: string;
    }) => {
      try {
        const response = await client.repositories.deleteReport({
          workspace,
          repo_slug: repository,
          commit,
          reportId
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
