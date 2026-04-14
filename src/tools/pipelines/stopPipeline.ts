import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the stop pipeline tool.
 * Sends a stop signal to an in-progress pipeline run identified by its UUID.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerStopPipelineTool(server: McpServer): void {
  server.tool(
    "bitbucket_stop_pipeline",
    {
      ...RepositorySchema.shape,
      pipelineUuid: z.string().describe('Pipeline UUID to stop')
    },
    async ({
      workspace,
      repository,
      pipelineUuid
    }: {
      workspace: string;
      repository: string;
      pipelineUuid: string;
    }) => {
      try {
        const response = await client.repositories.stopPipeline({
          workspace,
          repo_slug: repository,
          pipeline_uuid: pipelineUuid
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