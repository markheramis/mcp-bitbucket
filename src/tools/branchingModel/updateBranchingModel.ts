import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the update branching model settings tool.
 * Configures the branching model for a repository, including development and
 * production branch settings and optional branch-type prefixes.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerUpdateBranchingModelTool(server: McpServer): void {
  server.tool(
    "bitbucket_update_branching_model",
    {
      ...RepositorySchema.shape,
      developmentBranch: z.string().optional().describe('Name of the development branch (e.g. "develop")'),
      productionBranch: z.string().optional().describe('Name of the production branch (e.g. "main")'),
      featurePrefix: z.string().optional().describe('Prefix for feature branches (e.g. "feature/")'),
      bugfixPrefix: z.string().optional().describe('Prefix for bugfix branches (e.g. "bugfix/")'),
      releasePrefix: z.string().optional().describe('Prefix for release branches (e.g. "release/")'),
      hotfixPrefix: z.string().optional().describe('Prefix for hotfix branches (e.g. "hotfix/")')
    },
    async ({
      workspace,
      repository,
      developmentBranch,
      productionBranch,
      featurePrefix,
      bugfixPrefix,
      releasePrefix,
      hotfixPrefix
    }: {
      workspace: string;
      repository: string;
      developmentBranch?: string;
      productionBranch?: string;
      featurePrefix?: string;
      bugfixPrefix?: string;
      releasePrefix?: string;
      hotfixPrefix?: string;
    }) => {
      try {
        const body: any = {};

        if (developmentBranch) {
          body.development = { name: developmentBranch, use_mainbranch: false };
        }
        if (productionBranch) {
          body.production = { name: productionBranch, use_mainbranch: false, enabled: true };
        }

        const branchTypes: any[] = [];
        if (featurePrefix) branchTypes.push({ kind: 'feature', prefix: featurePrefix, enabled: true });
        if (bugfixPrefix) branchTypes.push({ kind: 'bugfix', prefix: bugfixPrefix, enabled: true });
        if (releasePrefix) branchTypes.push({ kind: 'release', prefix: releasePrefix, enabled: true });
        if (hotfixPrefix) branchTypes.push({ kind: 'hotfix', prefix: hotfixPrefix, enabled: true });
        if (branchTypes.length > 0) {
          body.branch_types = branchTypes;
        }

        const response = await client.repositories.updateBranchingModelSettings({
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
