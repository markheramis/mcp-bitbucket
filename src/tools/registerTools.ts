import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import all tool registration functions
import { registerWorkspacesTool } from "./workspaces/getWorkspaces.js";
import { registerGetWorkspaceDetailsTool } from "./workspaces/getWorkspaceDetails.js";
import { registerListWorkspaceMembersTool } from "./workspaces/listWorkspaceMembers.js";
import { registerGetWorkspaceMemberTool } from "./workspaces/getWorkspaceMember.js";
import { registerListWorkspacePermissionsTool } from "./workspaces/listWorkspacePermissions.js";
import { registerSearchWorkspaceAccountsTool } from "./workspaces/searchWorkspaceAccounts.js";
import { registerListProjectsTool } from "./projects/listProjects.js";
import { registerCreateProjectTool } from "./projects/createProject.js";
import { registerGetProjectTool } from "./projects/getProject.js";
import { registerUpdateProjectTool } from "./projects/updateProject.js";
import { registerDeleteProjectTool } from "./projects/deleteProject.js";
import { registerListRepositoriesTool } from "./repositories/listRepositories.js";
import { registerCreateRepositoryTool } from "./repositories/createRepository.js";
import { registerDeleteRepositoryTool } from "./repositories/deleteRepository.js";
import { registerGetRepositoryTool } from "./repositories/getRepository.js";
import { registerListBranchesTool } from "./repositories/listBranches.js";
import { registerCreateBranchTool } from "./repositories/createBranch.js";
import { registerListCommitsTool } from "./repositories/listCommits.js";
import { registerGetCommitTool } from "./repositories/getCommit.js";
import { registerListPullRequestsTool } from "./pullRequest/listPullRequests.js";
import { registerCreatePullRequestTool } from "./pullRequest/createPullRequest.js";
import { registerGetPullRequestTool } from "./pullRequest/getPullRequest.js";
import { registerMergePullRequestTool } from "./pullRequest/mergePullRequest.js";
import { registerDeclinePullRequestTool } from "./pullRequest/declinePullRequest.js";
import { registerGetReviewsTool } from "./pullRequest/getReviews.js";
import { registerGetDiffTool } from "./pullRequest/getDiff.js";
import { registerAddCommentTool } from "./comments/addComment.js";
import { registerListCommentsTool } from "./comments/listComments.js";
import { registerGetCommentTool } from "./comments/getComment.js";
import { registerUpdateCommentTool } from "./comments/updateComment.js";
import { registerDeleteCommentTool } from "./comments/deleteComment.js";
import { registerReplyToCommentTool } from "./comments/replyToComment.js";


/**
 * Register all Bitbucket API tools with the McpServer instance
 * @param server The McpServer instance to register tools with
 */
export function registerAllTools(server: McpServer): void {
  // Register all tools with the server
  registerWorkspacesTool(server);
  registerGetWorkspaceDetailsTool(server);
  registerListWorkspaceMembersTool(server);
  registerGetWorkspaceMemberTool(server);
  registerListWorkspacePermissionsTool(server);
  registerSearchWorkspaceAccountsTool(server);
  registerListProjectsTool(server);
  registerCreateProjectTool(server);
  registerGetProjectTool(server);
  registerUpdateProjectTool(server);
  registerDeleteProjectTool(server);
  registerListRepositoriesTool(server);
  registerCreateRepositoryTool(server);
  registerDeleteRepositoryTool(server);
  registerGetRepositoryTool(server);
  registerListBranchesTool(server);
  registerCreateBranchTool(server);
  registerListCommitsTool(server);
  registerGetCommitTool(server);
  registerListPullRequestsTool(server);
  registerCreatePullRequestTool(server);
  registerGetPullRequestTool(server);
  registerMergePullRequestTool(server);
  registerDeclinePullRequestTool(server);
  registerAddCommentTool(server);
  registerListCommentsTool(server);
  registerGetCommentTool(server);
  registerUpdateCommentTool(server);
  registerDeleteCommentTool(server);
  registerReplyToCommentTool(server);
  registerGetDiffTool(server);
  registerGetReviewsTool(server);
} 