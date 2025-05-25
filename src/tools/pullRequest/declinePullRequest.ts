import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { PullRequestParamsSchema } from '../../schemas.js';

export function registerDeclinePullRequestTool(server: McpServer) {
  server.tool(
    "bitbucket_decline_pull_request",
    {
      ...PullRequestParamsSchema.shape,
      message: z.string().optional().describe('Reason for declining')
    },
    async ({ workspace, repository, prId, message }: {
      workspace: string;
      repository: string;
      prId: number;
      message?: string;
    }) => {
      try {
        const response = await client.pullrequests.decline({
          workspace,
          repo_slug: repository,
          pull_request_id: prId
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