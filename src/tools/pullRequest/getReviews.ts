import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";


// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { PullRequestParamsSchema } from '../../schemas.js';

export function registerGetReviewsTool(server: McpServer) {
  server.tool(
    "bitbucket_get_reviews",
    PullRequestParamsSchema.shape,
    async ({ workspace, repository, prId }) => {
      try {
        // First get the PR to extract reviewers
        const prResponse = await client.pullrequests.get({
          workspace,
          repo_slug: repository,
          pull_request_id: prId
        });
        
        // Get activity stream to filter for approval events
        const activitiesResponse = await client.pullrequests.listActivities({
          workspace,
          repo_slug: repository,
          pull_request_id: prId
        });
        
        // Filter for approval activities
        const reviews = (activitiesResponse.data.values || [])
          .filter((activity: any) => activity.action === 'APPROVED' || activity.action === 'REVIEWED');
        
        return {
          content: [{ type: "text", text: JSON.stringify({
            reviewers: prResponse.data.reviewers,
            reviews
          }, null, 2) }]
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