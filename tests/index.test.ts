import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { execPath } from "process";

require('dotenv').config({ path: '.env.testing' });

type McpResponse = {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
};

/**
 * Parse the text payload returned by a tool call when it is valid JSON.
 * @param result The MCP tool response to parse.
 * @returns The parsed JSON payload.
 */
function parseJsonContent(result: McpResponse): unknown {
  return JSON.parse(result.content[0]?.text ?? 'null');
}

describe('MCP Bitbucket Server Tests', () => {
  let client: Client;

  const livePullRequestEnv = {
    workspace: process.env.TEST_BITBUCKET_WORKSPACE,
    repository: process.env.TEST_BITBUCKET_REPO_SLUG,
    prId: process.env.TEST_BITBUCKET_PULL_REQUEST_ID
  };
  const hasLivePullRequestEnv = Boolean(
    livePullRequestEnv.workspace &&
      livePullRequestEnv.repository &&
      livePullRequestEnv.prId
  );

  jest.setTimeout(60000);

  beforeAll(async () => {
    const rawTransportEnv: Record<string, string | undefined> = {
      BITBUCKET_BASE_URL: process.env.BITBUCKET_BASE_URL || process.env.BITBUCKET_URL,
      BITBUCKET_EMAIL: process.env.BITBUCKET_EMAIL,
      BITBUCKET_TOKEN: process.env.BITBUCKET_TOKEN,
      BITBUCKET_USERNAME: process.env.BITBUCKET_USERNAME,
      BITBUCKET_PASSWORD: process.env.BITBUCKET_PASSWORD,
      BITBUCKET_DEFAULT_PROJECT: process.env.BITBUCKET_DEFAULT_PROJECT
    };
    const transportEnv = Object.fromEntries(
      Object.entries(rawTransportEnv).filter((entry): entry is [string, string] => entry[1] !== undefined)
    );

    const transport = new StdioClientTransport({
      command: execPath,
      args: ['--loader', 'ts-node/esm', '--experimental-specifier-resolution=node', 'src/index.ts'],
      env: transportEnv
    });

    client = new Client({
      name: "bitbucket-test-client",
      version: "0.1.0"
    });

    await client.connect(transport);
  }, 30000);

  afterAll(async () => {
    await client.close();
  }, 30000);

  describe('Tool registration', () => {
    it('should advertise the expanded pull request workflow tools', async () => {
      const result = await client.listTools();
      const toolNames = result.tools.map((tool) => tool.name);

      expect(toolNames).toEqual(expect.arrayContaining([
        'bitbucket_approve_pull_request',
        'bitbucket_unapprove_pull_request',
        'bitbucket_request_changes_pull_request',
        'bitbucket_unrequest_changes_pull_request',
        'bitbucket_get_pull_request_activity',
        'bitbucket_list_pull_request_commits',
        'bitbucket_list_pull_request_tasks',
        'bitbucket_search_workspace_accounts',
        'bitbuicket_search_workspace_accounts'
      ]));
    });
  });

  describe('Read-only workspace smoke test', () => {
    it('should list workspaces', async () => {
      const result = await client.callTool({
        name: 'bitbucket_list_workspaces',
        arguments: {}
      }) as McpResponse;

      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);
    }, 30000);
  });

  describe('Live pull request workflow', () => {
    const maybeIt = hasLivePullRequestEnv ? it : it.skip;
    const livePullRequestArgs = {
      workspace: livePullRequestEnv.workspace as string,
      repository: livePullRequestEnv.repository as string,
      prId: Number(livePullRequestEnv.prId)
    };

    maybeIt('should approve and unapprove the fixture pull request', async () => {
      const approveResult = await client.callTool({
        name: 'bitbucket_approve_pull_request',
        arguments: livePullRequestArgs
      }) as McpResponse;
      const approvedPayload = parseJsonContent(approveResult) as { approved?: boolean; state?: string | null };

      expect(approveResult.isError).not.toBe(true);
      expect(approvedPayload).toEqual(expect.objectContaining({
        approved: true
      }));

      const unapproveResult = await client.callTool({
        name: 'bitbucket_unapprove_pull_request',
        arguments: livePullRequestArgs
      }) as McpResponse;

      expect(unapproveResult.isError).not.toBe(true);

      const prResult = await client.callTool({
        name: 'bitbucket_get_pull_request',
        arguments: livePullRequestArgs
      }) as McpResponse;
      const prPayload = parseJsonContent(prResult) as { participants?: Array<{ approved?: boolean }> };
      const approvingParticipant = prPayload.participants?.find((participant) => participant.approved);

      expect(approvingParticipant).toBeUndefined();
    }, 30000);

    maybeIt('should request changes and then remove the change request', async () => {
      const requestChangesResult = await client.callTool({
        name: 'bitbucket_request_changes_pull_request',
        arguments: livePullRequestArgs
      }) as McpResponse;
      const requestedPayload = parseJsonContent(requestChangesResult) as { state?: string | null };

      expect(requestChangesResult.isError).not.toBe(true);
      expect(requestedPayload.state).toBe('changes_requested');

      const unrequestChangesResult = await client.callTool({
        name: 'bitbucket_unrequest_changes_pull_request',
        arguments: livePullRequestArgs
      }) as McpResponse;

      expect(unrequestChangesResult.isError).not.toBe(true);

      const prResult = await client.callTool({
        name: 'bitbucket_get_pull_request',
        arguments: livePullRequestArgs
      }) as McpResponse;
      const prPayload = parseJsonContent(prResult) as { participants?: Array<{ state?: string | null }> };
      const changesRequestedParticipant = prPayload.participants?.find(
        (participant) => participant.state === 'changes_requested'
      );

      expect(changesRequestedParticipant).toBeUndefined();
    }, 30000);

    maybeIt('should fetch pull request activity, commits, and tasks', async () => {
      const activityResult = await client.callTool({
        name: 'bitbucket_get_pull_request_activity',
        arguments: livePullRequestArgs
      }) as McpResponse;
      const activityPayload = parseJsonContent(activityResult) as { values?: unknown[] };

      expect(activityResult.isError).not.toBe(true);
      expect(Array.isArray(activityPayload.values)).toBe(true);

      const commitsResult = await client.callTool({
        name: 'bitbucket_list_pull_request_commits',
        arguments: livePullRequestArgs
      }) as McpResponse;
      const commitsPayload = parseJsonContent(commitsResult) as { values?: unknown[] };

      expect(commitsResult.isError).not.toBe(true);
      expect(Array.isArray(commitsPayload.values)).toBe(true);

      const tasksResult = await client.callTool({
        name: 'bitbucket_list_pull_request_tasks',
        arguments: livePullRequestArgs
      }) as McpResponse;
      const tasksPayload = parseJsonContent(tasksResult) as { values?: unknown[] };

      expect(tasksResult.isError).not.toBe(true);
      expect(Array.isArray(tasksPayload.values)).toBe(true);
    }, 30000);
  });
});
