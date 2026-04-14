import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the get download tool.
 * Fetches metadata for a specific downloadable artifact by filename.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerGetDownloadTool(server: McpServer): void {
  server.tool(
    "bitbucket_get_download",
    {
      ...RepositorySchema.shape,
      filename: z.string().describe('Filename of the download artifact')
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
        const response = await client.repositories.getDownload({
          workspace,
          repo_slug: repository,
          filename
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
