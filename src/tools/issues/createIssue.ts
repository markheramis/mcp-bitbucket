import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the create issue tool.
 * Creates a new issue in the repository's issue tracker.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerCreateIssueTool(server: McpServer): void {
  server.tool(
    "bitbucket_create_issue",
    {
      ...RepositorySchema.shape,
      title: z.string().describe('Issue title'),
      content: z.string().optional().describe('Issue description / body text'),
      kind: z.enum(['bug', 'enhancement', 'proposal', 'task']).optional().describe('Issue kind'),
      priority: z.enum(['trivial', 'minor', 'major', 'critical', 'blocker']).optional().describe('Issue priority'),
      component: z.string().optional().describe('Component the issue belongs to'),
      milestone: z.string().optional().describe('Milestone name to associate the issue with'),
      version: z.string().optional().describe('Version name to associate the issue with')
    },
    async ({
      workspace,
      repository,
      title,
      content,
      kind,
      priority,
      component,
      milestone,
      version
    }: {
      workspace: string;
      repository: string;
      title: string;
      content?: string;
      kind?: string;
      priority?: string;
      component?: string;
      milestone?: string;
      version?: string;
    }) => {
      try {
        const body: any = { title };
        if (content) body.content = { raw: content };
        if (kind) body.kind = kind;
        if (priority) body.priority = priority;
        if (component) body.component = { name: component };
        if (milestone) body.milestone = { name: milestone };
        if (version) body.version = { name: version };

        const response = await client.repositories.createIssue({
          workspace,
          repo_slug: repository,
          _body: body
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
