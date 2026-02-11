import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { PullRequestParamsSchema } from '../../schemas.js';

export function registerReplyToCommentTool(server: McpServer) {
  server.tool(
    "bitbucket_reply_to_comment",
    {
      ...PullRequestParamsSchema.shape,
      parentId: z.number().describe('Parent comment ID to reply to'),
      text: z.string().describe('Reply text')
    },
    async ({ workspace, repository, prId, parentId, text }: { 
      workspace: string; 
      repository: string; 
      prId: number; 
      parentId: number;
      text: string;
    }) => {
      try {
        const response = await client.pullrequests.createComment({
          workspace,
          repo_slug: repository,
          pull_request_id: prId,
          _body: {
            content: { raw: text },
            parent: { id: parentId, type: "pullrequest_comment" },
            type: "pullrequest_comment"
          }
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