import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the get deployment tool.
 * Fetches a single deployment record identified by its UUID.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerGetDeploymentTool(server: McpServer): void {
  server.tool(
    "bitbucket_get_deployment",
    {
      ...RepositorySchema.shape,
      deploymentUuid: z.string().describe('Deployment UUID')
    },
    async ({
      workspace,
      repository,
      deploymentUuid
    }: {
      workspace: string;
      repository: string;
      deploymentUuid: string;
    }) => {
      try {
        const response = await client.repositories.getDeployment({
          workspace,
          repo_slug: repository,
          deployment_uuid: deploymentUuid
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
