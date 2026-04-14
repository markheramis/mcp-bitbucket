import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the trigger pipeline tool.
 * Triggers a new pipeline run for a repository against a specific branch or commit.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerTriggerPipelineTool(server: McpServer): void {
  server.tool(
    "bitbucket_trigger_pipeline",
    {
      ...RepositorySchema.shape,
      branch: z.string().optional().describe('Branch name to run the pipeline against'),
      commit: z.string().optional().describe('Commit hash to run the pipeline against (overrides branch)'),
      pattern: z.string().optional().describe('Custom pipeline pattern to run (e.g. "custom/deploy")')
    },
    async ({
      workspace,
      repository,
      branch,
      commit,
      pattern
    }: {
      workspace: string;
      repository: string;
      branch?: string;
      commit?: string;
      pattern?: string;
    }) => {
      try {
        const target: any = { type: 'pipeline_ref_target' };

        if (commit) {
          target.commit = { type: 'commit', hash: commit };
        } else if (branch) {
          target.ref_type = 'branch';
          target.ref_name = branch;
        }

        if (pattern) {
          target.selector = { type: 'custom', pattern };
        }

        const response = await client.repositories.createPipeline({
          workspace,
          repo_slug: repository,
          _body: { type: 'pipeline', target }
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
