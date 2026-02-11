import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { ProjectUpdateSchema } from '../../schemas.js';

export function registerUpdateProjectTool(server: McpServer) {
  server.tool(
    "bitbucket_update_project",
    ProjectUpdateSchema.shape,
    async ({ workspace, project, name, description }: {
      workspace: string;
      project: string;
      name?: string;
      description?: string;
    }) => {
      try {
        const response = await client.workspaces.createOrUpdateProject({
          workspace,
          project_key: project,
          _body: {
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