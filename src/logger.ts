import * as winston from 'winston';

// Configure logger
export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'bitbucket.log' })
  ]
}); 