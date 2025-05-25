import pkg from 'bitbucket';
import { logger } from './logger.js';
import { AuthBasic, AuthToken } from 'bitbucket/src/plugins/auth/types.js';
const { Bitbucket } = pkg;

// Bitbucket client types
export type BitbucketClient = {
  client: pkg.APIClient;
  config: any;
}

function getEnvConfig() {
  return {
    baseUrl: process.env.BITBUCKET_URL || 'https://api.bitbucket.org/2.0',
    token: process.env.BITBUCKET_TOKEN,
    username: process.env.BITBUCKET_USERNAME,
    password: process.env.BITBUCKET_PASSWORD
  };
}


// Initialize Bitbucket client with better auth handling
function createBitbucketClient(): BitbucketClient {
  // Configuration from environment variables or direct token
  const config = getEnvConfig();
  logger.info(config);
  // Configure Bitbucket client with proper options
  const clientOptions: any = {
    baseUrl: config.baseUrl,
    request: {
      timeout: 10000
    }
  };
  if (config.token) {
    let auth: AuthToken = { token: config.token };
    clientOptions.auth = auth;
  } else if (config.username && config.password) {
    let auth: AuthBasic = { 
      username: config.username, 
      password: config.password 
    };
    clientOptions.auth = auth;
  } else {
    throw new Error('No authentication credentials found in environment variables');
  }
  // Log the configuration (safely)
  logger.info('Bitbucket client configuration', {
    baseUrl: clientOptions.baseUrl,
    hasAuth: !!clientOptions.auth,
    authType: clientOptions.auth?.token ? 'token' : 
              (clientOptions.auth?.username ? 'basic' : 'none')
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