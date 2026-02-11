import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { ProjectSchema } from '../../schemas.js';

export function registerDeleteProjectTool(server: McpServer) {
  server.tool(
    "bitbucket_delete_project",
    ProjectSchema.shape,
    async ({ workspace, project }) => {
      try {
        await client.workspaces.deleteProject({
          workspace,
          project_key: project
        });
        
        return {
          content: [{ type: "text", text: JSON.stringify({ success: true, deleted: project }, null, 2) }]
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