import pkg from 'bitbucket';
import { logger } from './logger.js';
import { AuthBasic } from 'bitbucket/src/plugins/auth/types.js';
const { Bitbucket } = pkg;

// Bitbucket client types
export type BitbucketClient = {
  client: pkg.APIClient;
  config: any;
}

/** Default Bitbucket Cloud API base URL. */
const DEFAULT_BASE_URL = 'https://api.bitbucket.org/2.0';

/**
 * Load config from env. Aligned with atlassian-mcp naming:
 * BITBUCKET_BASE_URL, BITBUCKET_EMAIL, BITBUCKET_TOKEN.
 * Legacy: BITBUCKET_URL, BITBUCKET_USERNAME, BITBUCKET_PASSWORD.
 */
function getEnvConfig() {
  const baseUrl = process.env.BITBUCKET_BASE_URL
    || process.env.BITBUCKET_URL
    || DEFAULT_BASE_URL;
  const email = process.env.BITBUCKET_EMAIL;
  const token = process.env.BITBUCKET_TOKEN;
  const username = process.env.BITBUCKET_USERNAME;
  const password = process.env.BITBUCKET_PASSWORD;

  return {
    baseUrl,
    email,
    token,
    username,
    password
  };
}

/**
 * Resolve Basic auth credentials: prefer BITBUCKET_EMAIL + BITBUCKET_TOKEN
 * (same pattern as atlassian-mcp), fallback to BITBUCKET_USERNAME + BITBUCKET_PASSWORD.
 */
function getBasicAuth(config: ReturnType<typeof getEnvConfig>): (AuthBasic & { type: 'basic' }) | null {
  if (config.email && config.token) {
    return { type: 'basic', username: config.email, password: config.token };
  }
  if (config.username && config.password) {
    return { type: 'basic', username: config.username, password: config.password };
  }
  return null;
}

// Initialize Bitbucket client with auth aligned to atlassian-mcp (email + token, Basic auth)
function createBitbucketClient(): BitbucketClient {
  const config = getEnvConfig();
  logger.info({
    baseUrl: config.baseUrl,
    hasEmail: !!config.email,
    hasToken: !!config.token,
    hasUsername: !!config.username,
    hasPassword: !!config.password
  });

  const clientOptions: any = {
    baseUrl: config.baseUrl,
    request: {
      timeout: 10000
    }
  };

  const auth = getBasicAuth(config);
  if (auth) {
    clientOptions.auth = auth;
  } else {
    throw new Error(
      'No authentication credentials. Set BITBUCKET_EMAIL and BITBUCKET_TOKEN (or BITBUCKET_USERNAME and BITBUCKET_PASSWORD).'
    );
  }

  logger.info('Bitbucket client configuration', {
    baseUrl: clientOptions.baseUrl,
    hasAuth: true,
    authType: 'basic'
  });
  logger.info(JSON.stringify(clientOptions, null, 2));
  // Create the Bitbucket client
  const bitbucketClient = new Bitbucket(clientOptions);
  // Debug handler for requests - with proper typing
  const originalRequest = (bitbucketClient as any).request;
  (bitbucketClient as any).request = async function(route: string, options?: any) {
    try {
      logger.info(`Making Bitbucket API request`, { route, hasOptions: !!options });
      const response = await originalRequest.call(this, route, options);
      logger.info(`Bitbucket API response success`, { 
        status: response.status,
        headers: response.headers
      });
      return response;
    } catch (error: any) {
      logger.error(`Bitbucket API request error`, { 
        error: error.message,
        status: error.status,
        response: error.response?.data
      });
      throw error;
    }
  };
  return { 
    client: bitbucketClient,
    config 
  };
}

// Create and export the Bitbucket client
const { client, config } = createBitbucketClient();
export { client, config }; 