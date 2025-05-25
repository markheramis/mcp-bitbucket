import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { PullRequestParamsSchema } from '../../schemas.js';

export function registerAddCommentTool(server: McpServer) {
  server.tool(
    "bitbucket_add_comment",
    {
      ...PullRequestParamsSchema.shape,
      text: z.string().describe('Comment text'),
      parentId: z.number().optional().describe('Parent comment ID for replies')
    },
    async ({ workspace, repository, prId, text, parentId }: { 
      workspace: string; 
      repository: string; 
      prId: number; 
      text: string; 
      parentId?: number;
    }) => {
      try {
        const body: any = {
          content: { raw: text }
        };
        
        if (parentId) {
          body.parent = { id: parentId };
        }
        
        const response = await client.pullrequests.createComment({
          workspace,
          repo_slug: repository,
          pull_request_id: prId,
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