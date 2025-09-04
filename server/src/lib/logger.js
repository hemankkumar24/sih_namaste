const pino = require('pino');
const config = require('../config');

const logger = pino({
    level: config.logLevel,
    transport: config.env === 'development' ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
        },
    } : undefined,
});

module.exports = logger;