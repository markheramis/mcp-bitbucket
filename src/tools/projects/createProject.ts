import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { ProjectInputSchema } from '../../schemas.js';

export function registerCreateProjectTool(server: McpServer) {
  server.tool(
    "bitbucket_create_project",
    ProjectInputSchema.shape,
    async ({ workspace, key, name, description }) => {
      try {
        const response = await client.workspaces.createProject({
          workspace,
          _body: {
            key,
            name,
            description,
            type: 'NORMAL'
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