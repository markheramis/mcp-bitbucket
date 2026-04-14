import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the get pipeline tool.
 * Fetches details for a specific pipeline run identified by its UUID.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerGetPipelineTool(server: McpServer): void {
  server.tool(
    "bitbucket_get_pipeline",
    {
      ...RepositorySchema.shape,
      pipelineUuid: z.string().describe('Pipeline UUID (e.g. "{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}")')
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
        const response = await client.repositories.getPipeline({
          workspace,
          repo_slug: repository,
          pipeline_uuid: pipelineUuid
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
