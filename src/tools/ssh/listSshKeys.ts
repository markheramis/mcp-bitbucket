import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';

/**
 * Register the list SSH keys tool.
 * Returns all SSH public keys associated with a Bitbucket user account.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerListSshKeysTool(server: McpServer): void {
  server.tool(
    "bitbucket_list_ssh_keys",
    {
      username: z.string().describe('Bitbucket account ID or username to list SSH keys for')
    },
    async ({ username }: { username: string }) => {
      try {
        const response = await client.ssh.listKeys({
          selected_user: username
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
