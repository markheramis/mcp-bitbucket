import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

export function registerListBranchesTool(server: McpServer) {
  server.tool(
    "bitbucket_list_branches",
    RepositorySchema.shape,
    async ({ workspace, repository }: { workspace: string; repository: string }) => {
      try {
        const response = await client.refs.listBranches({
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