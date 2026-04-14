import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';

/**
 * Register the add SSH key tool.
 * Adds a new SSH public key to a Bitbucket user account.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerAddSshKeyTool(server: McpServer): void {
  server.tool(
    "bitbucket_add_ssh_key",
    {
      username: z.string().describe('Bitbucket account ID or username to add the SSH key to'),
      key: z.string().describe('SSH public key value (e.g. "ssh-rsa AAAA...")'),
      label: z.string().optional().describe('Human-readable label for the key')
    },
    async ({
      username,
      key,
      label
    }: {
      username: string;
      key: string;
      label?: string;
    }) => {
      try {
        const response = await client.ssh.createKey({
          selected_user: username,
          _body: { type: 'ssh_account_key', key, label }
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
