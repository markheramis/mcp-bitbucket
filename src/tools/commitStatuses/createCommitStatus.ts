import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the create commit status tool.
 * Posts a new build/CI status (e.g. SUCCESSFUL, FAILED, INPROGRESS) against a commit.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerCreateCommitStatusTool(server: McpServer): void {
  server.tool(
    "bitbucket_create_commit_status",
    {
      ...RepositorySchema.shape,
      commit: z.string().describe('Commit hash'),
      key: z.string().describe('Unique key identifying the build (e.g. "my-ci-tool")'),
      state: z.enum(['SUCCESSFUL', 'FAILED', 'INPROGRESS', 'STOPPED']).describe('Build state'),
      name: z.string().optional().describe('Human-readable name for the build'),
      url: z.string().url().describe('URL to the build results page'),
      description: z.string().optional().describe('Short description of the build result')
    },
    async ({
      workspace,
      repository,
      commit,
      key,
      state,
      name,
      url,
      description
    }: {
      workspace: string;
      repository: string;
      commit: string;
      key: string;
      state: 'SUCCESSFUL' | 'FAILED' | 'INPROGRESS' | 'STOPPED';
      name?: string;
      url: string;
      description?: string;
    }) => {
      try {
        const response = await client.repositories.createCommitBuildStatus({
          workspace,
          repo_slug: repository,
          commit,
          _body: { type: 'build', key, state, name, url, description }
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
