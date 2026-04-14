import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the update branch restriction tool.
 * Updates an existing branch restriction rule by its numeric ID.
 * The full restriction object must be supplied (PUT semantics).
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerUpdateBranchRestrictionTool(server: McpServer): void {
  server.tool(
    "bitbucket_update_branch_restriction",
    {
      ...RepositorySchema.shape,
      id: z.string().describe('Branch restriction ID to update'),
      kind: z.string().describe('Type of branch restriction'),
      pattern: z.string().describe('Branch name pattern (e.g. "main", "release/**")'),
      value: z.number().optional().describe('Numeric value for restrictions that require one')
    },
    async ({
      workspace,
      repository,
      id,
      kind,
      pattern,
      value
    }: {
      workspace: string;
      repository: string;
      id: string;
      kind: string;
      pattern: string;
      value?: number;
    }) => {
      try {
        const body: any = { kind, pattern };
        if (value !== undefined) {
          body.value = value;
        }

        const response = await client.repositories.updateBranchRestriction({
          workspace,
          repo_slug: repository,
          id,
          _body: body
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
