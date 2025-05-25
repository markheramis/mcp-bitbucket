import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { PullRequestParamsSchema } from '../../schemas.js';

export function registerGetCommentTool(server: McpServer) {
  server.tool(
    "bitbucket_get_comment",
    {
      ...PullRequestParamsSchema.shape,
      commentId: z.number().describe('Comment ID to retrieve')
    },
    async ({ workspace, repository, prId, commentId }: { 
      workspace: string; 
      repository: string; 
      prId: number; 
      commentId: number;
    }) => {
      try {
        const response = await client.pullrequests.getComment({
          workspace,
          repo_slug: repository,
          pull_request_id: prId,
          comment_id: commentId
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