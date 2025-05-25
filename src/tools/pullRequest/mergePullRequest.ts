import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { z } from "zod";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { PullRequestParamsSchema } from '../../schemas.js';

export function registerMergePullRequestTool(server: McpServer) {
  server.tool(
    "bitbucket_merge_pull_request",
    {
      ...PullRequestParamsSchema.shape,
      message: z.string().optional().describe('Merge commit message'),
      strategy: z.enum(['merge-commit', 'squash', 'fast-forward']).optional().describe('Merge strategy to use')
    },
    async ({ workspace, repository, prId, message, strategy = 'merge-commit' }) => {
      try {
        const response = await client.pullrequests.merge({
          workspace,
          repo_slug: repository,
          pull_request_id: prId,
          _body: {
            type: 'pullrequest',
            message,
            merge_strategy: strategy === 'merge-commit' ? 'merge_commit' : 
                          strategy === 'fast-forward' ? 'fast_forward' : 
                          'squash',
            close_source_branch: true
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