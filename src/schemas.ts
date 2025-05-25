import { z } from "zod";

// Schema definitions
export const WorkspaceSchema = z.object({
  workspace: z.string().describe('Bitbucket workspace slug')
});

export const ProjectSchema = WorkspaceSchema.extend({
  project: z.string().describe('Bitbucket project key')
});

export const RepositorySchema = WorkspaceSchema.extend({
  repository: z.string().describe('Repository slug')
});

export const PullRequestParamsSchema = RepositorySchema.extend({
  prId: z.number().describe('Pull request ID')
});

export const PullRequestInputSchema = RepositorySchema.extend({
  title: z.string().describe('PR title'),
  description: z.string().optional().describe('PR description'),
  sourceBranch: z.string().describe('Source branch name'),
  targetBranch: z.string().describe('Target branch name'),
  reviewers: z.array(z.string()).optional().describe('List of reviewer usernames')
});

export const ProjectInputSchema = WorkspaceSchema.extend({
  key: z.string().describe('Project key'),
  name: z.string().describe('Project name'),
  description: z.string().optional().describe('Project description')
});

export const ProjectUpdateSchema = ProjectSchema.extend({
  name: z.string().optional().describe('Updated project name'),
  description: z.string().optional().describe('Updated project description')
});

export const RepositoryInputSchema = ProjectSchema.extend({
  name: z.string().describe('Repository name'),
  description: z.string().optional().describe('Repository description')
});

export const MergeOptionsSchema = z.object({
  message: z.string().optional().describe('Merge commit message'),
  strategy: z.enum(['merge-commit', 'squash', 'fast-forward']).optional().describe('Merge strategy to use')
});

export const CommentOptionsSchema = z.object({
  text: z.string().describe('Comment text'),
  parentId: z.number().optional().describe('Parent comment ID for replies')
}); 