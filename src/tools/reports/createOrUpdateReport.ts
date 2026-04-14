import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';
import { RepositorySchema } from '../../schemas.js';

/**
 * Register the create or update report tool.
 * Creates a new code insight report or replaces an existing one for a given commit.
 * Reports can contain test results, code coverage, or security findings.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerCreateOrUpdateReportTool(server: McpServer): void {
  server.tool(
    "bitbucket_create_or_update_report",
    {
      ...RepositorySchema.shape,
      commit: z.string().describe('Commit hash to attach the report to'),
      reportId: z.string().describe('Unique report ID (used as the report key)'),
      title: z.string().describe('Report title'),
      details: z.string().optional().describe('Detailed description of the report'),
      reportType: z.enum(['SECURITY', 'COVERAGE', 'TEST', 'BUG']).optional().describe('Type of report'),
      result: z.enum(['PASSED', 'FAILED', 'PENDING']).optional().describe('Overall result of the report'),
      link: z.string().url().optional().describe('URL linking to the full report')
    },
    async ({
      workspace,
      repository,
      commit,
      reportId,
      title,
      details,
      reportType,
      result,
      link
    }: {
      workspace: string;
      repository: string;
      commit: string;
      reportId: string;
      title: string;
      details?: string;
      reportType?: string;
      result?: string;
      link?: string;
    }) => {
      try {
        const body: any = { title };
        if (details) body.details = details;
        if (reportType) body.report_type = reportType;
        if (result) body.result = result;
        if (link) body.link = link;

        const response = await client.repositories.createOrUpdateReport({
          workspace,
          repo_slug: repository,
          commit,
          reportId,
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
