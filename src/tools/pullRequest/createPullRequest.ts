import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { PullRequestInputSchema } from '../../schemas.js';

export function registerCreatePullRequestTool(server: McpServer) {
  server.tool(
    "bitbucket_create_pull_request",
    PullRequestInputSchema.shape,
    async ({ workspace, repository, title, description, sourceBranch, targetBranch, reviewers }: {
      workspace: string;
      repository: string;
      title: string;
      description?: string;
      sourceBranch: string;
      targetBranch: string;
      reviewers?: string[];
    }) => {
      try {
        const body: any = {
          title,
          description,
          source: {
            branch: { name: sourceBranch }
          },
          destination: {
            branch: { name: targetBranch }
          }
        };
        
        if (reviewers && reviewers.length > 0) {
          body.reviewers = reviewers.map((uuid: string) => ({ uuid }));
        }
        
        const response = await client.pullrequests.create({
          workspace,
          repo_slug: repository,
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