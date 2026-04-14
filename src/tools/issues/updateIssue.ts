import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the update issue tool.
 * Updates an existing issue's fields such as title, status, priority, or assignee.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerUpdateIssueTool(server: McpServer): void {
  server.tool(
    "bitbucket_update_issue",
    {
      ...RepositorySchema.shape,
      issueId: z.string().describe('Issue ID to update'),
      title: z.string().optional().describe('Updated issue title'),
      content: z.string().optional().describe('Updated issue body text'),
      status: z.enum(['new', 'open', 'resolved', 'on hold', 'invalid', 'duplicate', 'wontfix', 'closed']).optional().describe('Updated issue status'),
      kind: z.enum(['bug', 'enhancement', 'proposal', 'task']).optional().describe('Updated issue kind'),
      priority: z.enum(['trivial', 'minor', 'major', 'critical', 'blocker']).optional().describe('Updated issue priority'),
      assignee: z.string().optional().describe('Username of the assignee')
    },
    async ({
      workspace,
      repository,
      issueId,
      title,
      content,
      status,
      kind,
      priority,
      assignee
    }: {
      workspace: string;
      repository: string;
      issueId: string;
      title?: string;
      content?: string;
      status?: string;
      kind?: string;
      priority?: string;
      assignee?: string;
    }) => {
      try {
        const body: any = {};
        if (title) body.title = title;
        if (content) body.content = { raw: content };
        if (status) body.status = status;
        if (kind) body.kind = kind;
        if (priority) body.priority = priority;
        if (assignee) body.assignee = { account_id: assignee };

        const response = await client.repositories.updateIssue({
          workspace,
          repo_slug: repository,
          issue_id: issueId,
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
