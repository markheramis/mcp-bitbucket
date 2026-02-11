import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";


// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

export function registerDeleteRepositoryTool(server: McpServer) {
  server.tool(
    "bitbucket_delete_repository",
    RepositorySchema.shape,
    async ({ workspace, repository }) => {
      try {
        await client.repositories.delete({
          workspace,
          repo_slug: repository
        });
        
        return {
          content: [{ type: "text", text: JSON.stringify({ success: true, deleted: repository }, null, 2) }]
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