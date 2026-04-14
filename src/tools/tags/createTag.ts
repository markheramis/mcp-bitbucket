import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the create tag tool.
 * Creates a new git tag pointing at a specific commit hash.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerCreateTagTool(server: McpServer): void {
  server.tool(
    "bitbucket_create_tag",
    {
      ...RepositorySchema.shape,
      name: z.string().describe('Tag name (e.g. "v1.0.0")'),
      hash: z.string().describe('Commit hash the tag should point to'),
      message: z.string().optional().describe('Optional tag message (creates an annotated tag)')
    },
    async ({
      workspace,
      repository,
      name,
      hash,
      message
    }: {
      workspace: string;
      repository: string;
      name: string;
      hash: string;
      message?: string;
    }) => {
      try {
        const body: any = {
          name,
          target: { hash }
        };
        if (message) {
          body.message = message;
        }

        const response = await client.repositories.createTag({
          workspace,
          repo_slug: repository,
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
