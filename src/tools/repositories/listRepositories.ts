import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { z } from "zod";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { WorkspaceSchema } from '../../schemas.js';

export function registerListRepositoriesTool(server: McpServer) {
  server.tool(
    "bitbucket_list_repositories",
    {
      ...WorkspaceSchema.shape,
      project: z.string().optional().describe('Project key')
    },
    async ({ workspace, project }) => {
      try {
        const params: any = { workspace };
        
        if (project) {
          params.q = `project.key="${project}"`;
        }
        
        const response = await client.repositories.list(params);
        
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