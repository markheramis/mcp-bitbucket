import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { logger } from '../../logger.js';
import { client } from '../../bitbucketClient.js';

/**
 * Register the delete SSH key tool.
 * Removes an SSH public key from a Bitbucket user account by its key ID.
 * @param server The MCP server instance that exposes the tool.
 * @returns Nothing.
 */
export function registerDeleteSshKeyTool(server: McpServer): void {
  server.tool(
    "bitbucket_delete_ssh_key",
    {
      username: z.string().describe('Bitbucket account ID or username'),
      keyId: z.string().describe('SSH key ID to remove')
    },
    async ({
      username,
      keyId
    }: {
      username: string;
      keyId: string;
    }) => {
      try {
        const response = await client.ssh.deleteKey({
          selected_user: username,
          key_id: keyId
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data ?? { success: true }, null, 2) }]
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
