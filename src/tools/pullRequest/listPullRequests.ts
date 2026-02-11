import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

export function registerListPullRequestsTool(server: McpServer) {
  server.tool(
    "bitbucket_list_pull_requests",
    RepositorySchema.shape,
    async ({ workspace, repository }) => {
      try {
        const response = await client.repositories.listPullRequests({
          workspace,
          repo_slug: repository
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