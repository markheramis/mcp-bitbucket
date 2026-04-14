import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the create branch restriction tool.
 * Creates a new branch restriction rule on a repository (e.g. require approvals,
 * restrict pushes, require passing builds).
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerCreateBranchRestrictionTool(server: McpServer): void {
  server.tool(
    "bitbucket_create_branch_restriction",
    {
      ...RepositorySchema.shape,
      kind: z.enum([
        'require_tasks_to_be_completed',
        'require_passing_builds_to_merge',
        'force',
        'restrict_merges',
        'enforce_merge_checks',
        'require_approvals_to_merge',
        'delete',
        'require_default_reviewer_approvals_to_merge',
        'require_no_changes_requested',
        'require_commits_behind',
        'reset_pullrequest_approvals_on_change',
        'smart_reset_pullrequest_approvals',
        'push',
        'require_all_dependencies_merged',
        'require_all_comments_resolved',
        'reset_pullrequest_changes_requested_on_change',
        'require_lineage',
        'allow_auto_merge_when_builds_pass'
      ]).describe('Type of branch restriction'),
      pattern: z.string().describe('Branch name pattern (e.g. "main", "release/**")'),
      value: z.number().optional().describe('Numeric value for restrictions that require one (e.g. number of approvals)')
    },
    async ({
      workspace,
      repository,
      kind,
      pattern,
      value
    }: {
      workspace: string;
      repository: string;
      kind: string;
      pattern: string;
      value?: number;
    }) => {
      try {
        const body: any = { kind, pattern };
        if (value !== undefined) {
          body.value = value;
        }

        const response = await client.repositories.createBranchRestriction({
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
