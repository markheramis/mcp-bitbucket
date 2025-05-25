#!/usr/bin/env node

// Set up error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

// Set up error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});

// Disable the Bitbucket API updates message
process.env.DISABLE_BITBUCKET_API_UPDATES = 'true';

// Patch console.log to filter unwanted messages
const originalConsoleLog = console.log;
console.log = function(...args) {
  // Skip the "BITBUCKET CLOUD API LATEST UPDATES" message
  if (args.length > 0 && 
      typeof args[0] === 'string' && 
      args[0].includes('BITBUCKET CLOUD API LATEST UPDATES')) {
    return;
  }
  
  originalConsoleLog.apply(console, args);
};

// Standard color constants from ANSI escape codes
const colors = {
  cyan: '\x1b[36m',
  bgCyan: '\x1b[46m',
  black: '\x1b[30m',
  reset: '\x1b[0m'
};

// Override the process.stdout.write to filter unwanted messages
const originalStdoutWrite = process.stdout.write;
process.stdout.write = function(buffer, encoding, callback) {
  // Convert Buffer to string if needed
  const str = buffer instanceof Buffer ? buffer.toString() : buffer;
  
  // Check if it contains the unwanted message
  if (typeof str === 'string' && 
      str.includes('BITBUCKET CLOUD API LATEST UPDATES')) {
    // Just handle the callback if provided
    if (typeof callback === 'function') {
      callback();
    }
    return true; // Indicate success without actually writing
  }
  
  // Original behavior for everything else
  return originalStdoutWrite.apply(this, arguments);
};

try {
  // Now load the actual server module - use the correct path from the build output
  console.log('Starting Bitbucket MCP server...');
  require('./build/index.js');
  console.log('Bitbucket MCP server started successfully');
} catch (err) {
  console.error('Failed to start Bitbucket MCP server:', err);
} 