import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { PullRequestParamsSchema } from '../../schemas.js';

export function registerListCommentsTool(server: McpServer) {
  server.tool(
    "bitbucket_list_comments",
    PullRequestParamsSchema.shape,
    async ({ workspace, repository, prId }: { 
      workspace: string; 
      repository: string; 
      prId: number; 
    }) => {
      try {
        const response = await client.pullrequests.listComments({
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