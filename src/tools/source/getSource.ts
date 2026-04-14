import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the get source tool.
 * Browses a directory or retrieves file metadata at a specific commit or branch.
 * Returns directory listings (tree entries) or metadata about a single file.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerGetSourceTool(server: McpServer): void {
  server.tool(
    "bitbucket_get_source",
    {
      ...RepositorySchema.shape,
      commit: z.string().describe('Commit hash or branch name to browse at'),
      path: z.string().describe('File or directory path within the repository (e.g. "src/index.ts")'),
      format: z.enum(['meta', 'rendered']).optional().describe('Response format: "meta" for metadata only')
    },
    async ({
      workspace,
      repository,
      commit,
      path,
      format
    }: {
      workspace: string;
      repository: string;
      commit: string;
      path: string;
      format?: 'meta' | 'rendered';
    }) => {
      try {
        const response = await client.repositories.readSrc({
          workspace,
          repo_slug: repository,
          commit,
          path,
          format
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
