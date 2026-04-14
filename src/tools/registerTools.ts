import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Workspaces
import { registerWorkspacesTool } from "./workspaces/getWorkspaces.js";
import { registerGetWorkspaceDetailsTool } from "./workspaces/getWorkspaceDetails.js";
import { registerListWorkspaceMembersTool } from "./workspaces/listWorkspaceMembers.js";
import { registerGetWorkspaceMemberTool } from "./workspaces/getWorkspaceMember.js";
import { registerListWorkspacePermissionsTool } from "./workspaces/listWorkspacePermissions.js";
import { registerSearchWorkspaceAccountsTool } from "./workspaces/searchWorkspaceAccounts.js";

// Projects
import { registerListProjectsTool } from "./projects/listProjects.js";
import { registerCreateProjectTool } from "./projects/createProject.js";
import { registerGetProjectTool } from "./projects/getProject.js";
import { registerUpdateProjectTool } from "./projects/updateProject.js";
import { registerDeleteProjectTool } from "./projects/deleteProject.js";

// Repositories
import { registerListRepositoriesTool } from "./repositories/listRepositories.js";
import { registerCreateRepositoryTool } from "./repositories/createRepository.js";
import { registerDeleteRepositoryTool } from "./repositories/deleteRepository.js";
import { registerGetRepositoryTool } from "./repositories/getRepository.js";
import { registerListBranchesTool } from "./repositories/listBranches.js";
import { registerCreateBranchTool } from "./repositories/createBranch.js";
import { registerListCommitsTool } from "./repositories/listCommits.js";
import { registerGetCommitTool } from "./repositories/getCommit.js";

// Pull Requests
import { registerListPullRequestsTool } from "./pullRequest/listPullRequests.js";
import { registerCreatePullRequestTool } from "./pullRequest/createPullRequest.js";
import { registerGetPullRequestTool } from "./pullRequest/getPullRequest.js";
import { registerMergePullRequestTool } from "./pullRequest/mergePullRequest.js";
import { registerDeclinePullRequestTool } from "./pullRequest/declinePullRequest.js";
import { registerGetReviewsTool } from "./pullRequest/getReviews.js";
import { registerGetDiffTool } from "./pullRequest/getDiff.js";
import { registerApprovePullRequestTool } from "./pullRequest/approvePullRequest.js";
import { registerUnapprovePullRequestTool } from "./pullRequest/unapprovePullRequest.js";
import { registerRequestChangesPullRequestTool } from "./pullRequest/requestChangesPullRequest.js";
import { registerUnrequestChangesPullRequestTool } from "./pullRequest/unrequestChangesPullRequest.js";
import { registerGetPullRequestActivityTool } from "./pullRequest/getPullRequestActivity.js";
import { registerListPullRequestCommitsTool } from "./pullRequest/listPullRequestCommits.js";
import { registerListPullRequestTasksTool } from "./pullRequest/listPullRequestTasks.js";

// Comments
import { registerAddCommentTool } from "./comments/addComment.js";
import { registerListCommentsTool } from "./comments/listComments.js";
import { registerGetCommentTool } from "./comments/getComment.js";
import { registerUpdateCommentTool } from "./comments/updateComment.js";
import { registerDeleteCommentTool } from "./comments/deleteComment.js";
import { registerReplyToCommentTool } from "./comments/replyToComment.js";

// Branch Restrictions
import { registerListBranchRestrictionsTool } from "./branchRestrictions/listBranchRestrictions.js";
import { registerCreateBranchRestrictionTool } from "./branchRestrictions/createBranchRestriction.js";
import { registerGetBranchRestrictionTool } from "./branchRestrictions/getBranchRestriction.js";
import { registerUpdateBranchRestrictionTool } from "./branchRestrictions/updateBranchRestriction.js";
import { registerDeleteBranchRestrictionTool } from "./branchRestrictions/deleteBranchRestriction.js";

// Branching Model
import { registerGetBranchingModelTool } from "./branchingModel/getBranchingModel.js";
import { registerUpdateBranchingModelTool } from "./branchingModel/updateBranchingModel.js";

// Commit Statuses
import { registerListCommitStatusesTool } from "./commitStatuses/listCommitStatuses.js";
import { registerCreateCommitStatusTool } from "./commitStatuses/createCommitStatus.js";
import { registerUpdateCommitStatusTool } from "./commitStatuses/updateCommitStatus.js";

// Pipelines
import { registerListPipelinesTool } from "./pipelines/listPipelines.js";
import { registerGetPipelineTool } from "./pipelines/getPipeline.js";
import { registerTriggerPipelineTool } from "./pipelines/triggerPipeline.js";
import { registerStopPipelineTool } from "./pipelines/stopPipeline.js";

// Deployments
import { registerListDeploymentsTool } from "./deployments/listDeployments.js";
import { registerGetDeploymentTool } from "./deployments/getDeployment.js";

// Issues
import { registerListIssuesTool } from "./issues/listIssues.js";
import { registerCreateIssueTool } from "./issues/createIssue.js";
import { registerGetIssueTool } from "./issues/getIssue.js";
import { registerUpdateIssueTool } from "./issues/updateIssue.js";
import { registerDeleteIssueTool } from "./issues/deleteIssue.js";
import { registerListIssueCommentsTool } from "./issues/listIssueComments.js";
import { registerCreateIssueCommentTool } from "./issues/createIssueComment.js";

// Snippets
import { registerListSnippetsTool } from "./snippets/listSnippets.js";
import { registerCreateSnippetTool } from "./snippets/createSnippet.js";
import { registerGetSnippetTool } from "./snippets/getSnippet.js";
import { registerUpdateSnippetTool } from "./snippets/updateSnippet.js";
import { registerDeleteSnippetTool } from "./snippets/deleteSnippet.js";

// Webhooks
import { registerListWebhooksTool } from "./webhooks/listWebhooks.js";
import { registerCreateWebhookTool } from "./webhooks/createWebhook.js";
import { registerGetWebhookTool } from "./webhooks/getWebhook.js";
import { registerUpdateWebhookTool } from "./webhooks/updateWebhook.js";
import { registerDeleteWebhookTool } from "./webhooks/deleteWebhook.js";

// Downloads
import { registerListDownloadsTool } from "./downloads/listDownloads.js";
import { registerGetDownloadTool } from "./downloads/getDownload.js";
import { registerDeleteDownloadTool } from "./downloads/deleteDownload.js";

// Tags
import { registerListTagsTool } from "./tags/listTags.js";
import { registerCreateTagTool } from "./tags/createTag.js";
import { registerGetTagTool } from "./tags/getTag.js";
import { registerDeleteTagTool } from "./tags/deleteTag.js";

// Reports
import { registerListReportsTool } from "./reports/listReports.js";
import { registerCreateOrUpdateReportTool } from "./reports/createOrUpdateReport.js";
import { registerGetReportTool } from "./reports/getReport.js";
import { registerDeleteReportTool } from "./reports/deleteReport.js";

// Permissions
import { registerListUserPermissionsTool } from "./permissions/listUserPermissions.js";
import { registerListGroupPermissionsTool } from "./permissions/listGroupPermissions.js";
import { registerUpdateUserPermissionTool } from "./permissions/updateUserPermission.js";
import { registerUpdateGroupPermissionTool } from "./permissions/updateGroupPermission.js";
import { registerDeleteUserPermissionTool } from "./permissions/deleteUserPermission.js";
import { registerDeleteGroupPermissionTool } from "./permissions/deleteGroupPermission.js";

// Source / Browse
import { registerGetSourceTool } from "./source/getSource.js";
import { registerBrowseRepositoryTool } from "./source/browseRepository.js";

// SSH Keys
import { registerListSshKeysTool } from "./ssh/listSshKeys.js";
import { registerAddSshKeyTool } from "./ssh/addSshKey.js";
import { registerDeleteSshKeyTool } from "./ssh/deleteSshKey.js";

/**
 * Register all Bitbucket API tools with the McpServer instance.
 * Groups are: workspaces, projects, repositories, pull requests, comments,
 * branch restrictions, branching model, commit statuses, pipelines, deployments,
 * issues, snippets, webhooks, downloads, tags, reports, permissions, source, SSH keys.
 * @param server The McpServer instance to register tools with.
 * @returns Nothing.
 */
export function registerAllTools(server: McpServer): void {
  // Workspaces
  registerWorkspacesTool(server);
  registerGetWorkspaceDetailsTool(server);
  registerListWorkspaceMembersTool(server);
  registerGetWorkspaceMemberTool(server);
  registerListWorkspacePermissionsTool(server);
  registerSearchWorkspaceAccountsTool(server);

  // Projects
  registerListProjectsTool(server);
  registerCreateProjectTool(server);
  registerGetProjectTool(server);
  registerUpdateProjectTool(server);
  registerDeleteProjectTool(server);

  // Repositories
  registerListRepositoriesTool(server);
  registerCreateRepositoryTool(server);
  registerDeleteRepositoryTool(server);
  registerGetRepositoryTool(server);
  registerListBranchesTool(server);
  registerCreateBranchTool(server);
  registerListCommitsTool(server);
  registerGetCommitTool(server);

  // Pull Requests
  registerListPullRequestsTool(server);
  registerCreatePullRequestTool(server);
  registerGetPullRequestTool(server);
  registerMergePullRequestTool(server);
  registerDeclinePullRequestTool(server);
  registerApprovePullRequestTool(server);
  registerUnapprovePullRequestTool(server);
  registerRequestChangesPullRequestTool(server);
  registerUnrequestChangesPullRequestTool(server);
  registerGetPullRequestActivityTool(server);
  registerListPullRequestCommitsTool(server);
  registerListPullRequestTasksTool(server);

  // Comments
  registerAddCommentTool(server);
  registerListCommentsTool(server);
  registerGetCommentTool(server);
  registerUpdateCommentTool(server);
  registerDeleteCommentTool(server);
  registerReplyToCommentTool(server);
  registerGetDiffTool(server);
  registerGetReviewsTool(server);

  // Branch Restrictions
  registerListBranchRestrictionsTool(server);
  registerCreateBranchRestrictionTool(server);
  registerGetBranchRestrictionTool(server);
  registerUpdateBranchRestrictionTool(server);
  registerDeleteBranchRestrictionTool(server);

  // Branching Model
  registerGetBranchingModelTool(server);
  registerUpdateBranchingModelTool(server);

  // Commit Statuses
  registerListCommitStatusesTool(server);
  registerCreateCommitStatusTool(server);
  registerUpdateCommitStatusTool(server);

  // Pipelines
  registerListPipelinesTool(server);
  registerGetPipelineTool(server);
  registerTriggerPipelineTool(server);
  registerStopPipelineTool(server);

  // Deployments
  registerListDeploymentsTool(server);
  registerGetDeploymentTool(server);

  // Issues
  registerListIssuesTool(server);
  registerCreateIssueTool(server);
  registerGetIssueTool(server);
  registerUpdateIssueTool(server);
  registerDeleteIssueTool(server);
  registerListIssueCommentsTool(server);
  registerCreateIssueCommentTool(server);

  // Snippets
  registerListSnippetsTool(server);
  registerCreateSnippetTool(server);
  registerGetSnippetTool(server);
  registerUpdateSnippetTool(server);
  registerDeleteSnippetTool(server);

  // Webhooks
  registerListWebhooksTool(server);
  registerCreateWebhookTool(server);
  registerGetWebhookTool(server);
  registerUpdateWebhookTool(server);
  registerDeleteWebhookTool(server);

  // Downloads
  registerListDownloadsTool(server);
  registerGetDownloadTool(server);
  registerDeleteDownloadTool(server);

  // Tags
  registerListTagsTool(server);
  registerCreateTagTool(server);
  registerGetTagTool(server);
  registerDeleteTagTool(server);

  // Reports
  registerListReportsTool(server);
  registerCreateOrUpdateReportTool(server);
  registerGetReportTool(server);
  registerDeleteReportTool(server);

  // Permissions
  registerListUserPermissionsTool(server);
  registerListGroupPermissionsTool(server);
  registerUpdateUserPermissionTool(server);
  registerUpdateGroupPermissionTool(server);
  registerDeleteUserPermissionTool(server);
  registerDeleteGroupPermissionTool(server);

  // Source / Browse
  registerGetSourceTool(server);
  registerBrowseRepositoryTool(server);

  // SSH Keys
  registerListSshKeysTool(server);
  registerAddSshKeyTool(server);
  registerDeleteSshKeyTool(server);
}
