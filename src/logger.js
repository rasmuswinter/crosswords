import logger from 'winston';
import moment from 'moment';

import config from '../config'

/*
 * Configure default Winston logger with local transport
 */

// Remove existing transports
logger.clear();

// Set lowest log level
logger.add(logger.transports.Console, {
    level: config.logging.serverLevel,
    stderrLevels: ['error'],
    colorize: true,
    timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss')
});