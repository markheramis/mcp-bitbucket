import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { PullRequestParamsSchema } from '../../schemas.js';

export function registerGetDiffTool(server: McpServer) {
  server.tool(
    "bitbucket_get_diff",
    {
      ...PullRequestParamsSchema.shape,
      contextLines: z.number().optional().describe('Number of context lines')
    },
    async ({ workspace, repository, prId, contextLines = 10 }: {
      workspace: string;
      repository: string;
      prId: number;
      contextLines?: number;
    }) => {
      try {
        const response = await client.pullrequests.getDiff({
          workspace,
          repo_slug: repository,
          pull_request_id: prId
        });
        
        return {
          content: [{ type: "text", text: response.data as string }]
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