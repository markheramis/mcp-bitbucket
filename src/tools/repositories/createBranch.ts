import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

export function registerCreateBranchTool(server: McpServer) {
  server.tool(
    "bitbucket_create_branch",
    {
      ...RepositorySchema.shape,
      name: z.string().describe('Branch name'),
      target: z.string().describe('Target commit hash or branch name')
    },
    async ({ 
      workspace, 
      repository, 
      name, 
      target 
    }: { 
      workspace: string; 
      repository: string; 
      name: string; 
      target: string 
    }) => {
      try {
        const response = await client.refs.createBranch({
          workspace,
          repo_slug: repository,
          _body: {
            name,
            target: {
              hash: target
            }
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