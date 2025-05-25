import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";


// Import from shared modules
import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositoryInputSchema } from '../../schemas.js';

export function registerCreateRepositoryTool(server: McpServer) {
  server.tool(
    "bitbucket_create_repository",
    RepositoryInputSchema.shape,
    async ({ workspace, project, name, description }) => {
      try {
        const response = await client.repositories.create({
          workspace,
          repo_slug: name.toLowerCase().replace(/\s+/g, '-'),
          _body: {
            scm: "git",
            name,
            description,
            project: { key: project, type: 'NORMAL' },
            type: 'repository'
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