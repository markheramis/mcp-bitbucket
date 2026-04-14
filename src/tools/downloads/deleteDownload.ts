import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the delete download tool.
 * Removes a downloadable artifact from a repository by filename.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerDeleteDownloadTool(server: McpServer): void {
  server.tool(
    "bitbucket_delete_download",
    {
      ...RepositorySchema.shape,
      filename: z.string().describe('Filename of the download artifact to remove')
    },
    async ({
      workspace,
      repository,
      filename
    }: {
      workspace: string;
      repository: string;
      filename: string;
    }) => {
      try {
        const response = await client.repositories.deleteDownload({
          workspace,
          repo_slug: repository,
          filename
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
