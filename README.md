# Bitbucket MCP Server

An MCP (Model Context Protocol) server for managing Bitbucket Server/Cloud pull requests and repositories. This server provides a collection of tools that allow AI assistants to interact with Bitbucket APIs.

## Features

- Workspace management tools
- Project creation and management
- Repository operations
- Pull request creation, reviews, and management
- Comment operations
- Branch management
- Commit information retrieval

## Installation

Ensure you have Node.js 18 or higher installed, then:

```bash
# Clone the repository
git clone <repository-url>
cd bitbucket-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```
BITBUCKET_URL=https://api.bitbucket.org/2.0
BITBUCKET_TOKEN=your_access_token
# Or use username/password authentication
BITBUCKET_USERNAME=your_username
BITBUCKET_PASSWORD=your_password
```

## Usage

### Starting the server

```bash
# Start the server
npm start

# For development (with auto-recompilation)
npm run start:dev
```

### Using the MCP Inspector

To inspect and test the MCP server:

```bash
npm run inspector
```

## Available Tools

The server exposes the following categories of tools:

- **Workspace Tools**: List workspaces, get workspace details, manage members and permissions
- **Project Tools**: Create, list, update, and delete projects
- **Repository Tools**: Create, manage, and delete repositories, list branches and commits
- **Pull Request Tools**: Create, list, merge, decline pull requests, get diffs and reviews
- **Comment Tools**: Add, list, update, and delete comments on pull requests

## Development

```bash
# Run tests
npm test

# Run linter
npm run lint

# Watch mode for development
npm run dev
```

## License

[MIT](LICENSE) 