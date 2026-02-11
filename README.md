# Bitbucket MCP Server

An MCP (Model Context Protocol) server for managing Bitbucket Server/Cloud pull requests and repositories. This server provides a collection of tools that allow AI assistants to interact with Bitbucket APIs.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [With Cline](#with-cline)
  - [With Cursor](#with-cursor)
  - [With Claude Desktop](#with-claude-desktop)
  - [Starting the server](#starting-the-server)
  - [Using the MCP Inspector](#using-the-mcp-inspector)
- [Available Tools](#available-tools)
- [Development](#development)
- [License](#license)

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

Environment variable names align with [atlassian-mcp](https://github.com/kompallik/ATLASSIAN-MCP) for consistency across Atlassian MCP servers.

Create a `.env` file in the root directory (or set env in your MCP client):

**Recommended (same pattern as atlassian-mcp):**

```
BITBUCKET_BASE_URL=https://api.bitbucket.org/2.0
BITBUCKET_EMAIL=your-email@example.com
BITBUCKET_TOKEN=your-atlassian-api-token
```

Use the same [Atlassian API token](https://id.atlassian.com/manage-profile/security/api-tokens) as for Jira/Confluence; Bitbucket Cloud accepts it via Basic auth with your email and token.

**Legacy (still supported):**

```
BITBUCKET_BASE_URL=https://api.bitbucket.org/2.0
# Or BITBUCKET_URL
BITBUCKET_USERNAME=your_username
BITBUCKET_PASSWORD=your_app_password
```

## Usage

### With Cline

Add the following to your Cline MCP settings:

```json
{
  "mcpServers": {
    "bitbucket-server": {
      "command": "node",
      "args": ["/path/to/mcp-bitbucket/build/index.js"],
      "env": {
        "BITBUCKET_BASE_URL": "https://api.bitbucket.org/2.0",
        "BITBUCKET_EMAIL": "your-email@example.com",
        "BITBUCKET_TOKEN": "your-atlassian-api-token"
      },
      "disabled": false
    }
  }
}
```

Replace `/path/to/mcp-bitbucket` with the actual path to your clone.

### With Cursor

Add to your Cursor settings (`~/.cursor/mcp.json` or project `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "bitbucket-server": {
      "command": "node",
      "args": ["C:\\path\\to\\mcp-bitbucket\\build\\index.js"],
      "env": {
        "BITBUCKET_BASE_URL": "https://api.bitbucket.org/2.0",
        "BITBUCKET_EMAIL": "your-email@example.com",
        "BITBUCKET_TOKEN": "your-atlassian-api-token"
      },
      "disabled": false
    }
  }
}
```

On macOS/Linux, use a path like `"/path/to/mcp-bitbucket/build/index.js"` in `args`.

### With Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "bitbucket-server": {
      "command": "node",
      "args": ["/path/to/mcp-bitbucket/build/index.js"],
      "env": {
        "BITBUCKET_BASE_URL": "https://api.bitbucket.org/2.0",
        "BITBUCKET_EMAIL": "your-email@example.com",
        "BITBUCKET_TOKEN": "your-atlassian-api-token"
      }
    }
  }
}
```

Replace `/path/to/mcp-bitbucket` with the actual path to your clone.

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