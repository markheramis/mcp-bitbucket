import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the get branch restriction tool.
 * Fetches a single branch restriction by its numeric ID.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerGetBranchRestrictionTool(server: McpServer): void {
  server.tool(
    "bitbucket_get_branch_restriction",
    {
      ...RepositorySchema.shape,
      id: z.string().describe('Branch restriction ID')
    },
    async ({
      workspace,
      repository,
      id
    }: {
      workspace: string;
      repository: string;
      id: string;
    }) => {
      try {
        const response = await client.repositories.getBranchRestriction({
          workspace,
          repo_slug: repository,
          id
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
