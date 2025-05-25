import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

export function registerGetCommitTool(server: McpServer) {
  server.tool(
    "bitbucket_get_commit",
    {
      ...RepositorySchema.shape,
      commit: z.string().describe('Commit hash to retrieve')
    },
    async ({ 
      workspace, 
      repository, 
      commit 
    }: { 
      workspace: string; 
      repository: string; 
      commit: string;
    }) => {
      try {
        const response = await client.commits.get({
          workspace,
          repo_slug: repository,
          commit
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