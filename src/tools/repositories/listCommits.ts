import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

export function registerListCommitsTool(server: McpServer) {
  server.tool(
    "bitbucket_list_commits",
    {
      ...RepositorySchema.shape,
      branch: z.string().optional().describe('Branch name to filter commits')
    },
    async ({ 
      workspace, 
      repository, 
      branch 
    }: { 
      workspace: string; 
      repository: string; 
      branch?: string;
    }) => {
      try {
        const params: any = {
          workspace,
          repo_slug: repository
        };
        
        if (branch) {
          params.include = branch;
        }
        
        const response = await client.commits.list(params);
        
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