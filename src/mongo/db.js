import Promise from 'bluebird';
import mongoose from 'mongoose';
import logger from 'winston';

import config from '../../config';
// register mongoose models
import './crossword.model';

// build connection string
const dbConfig = config.db;
let connectionString = 'mongodb://';
if (dbConfig.username) {
  connectionString += dbConfig.username + ':' + dbConfig.password + '@';
}
const hosts = dbConfig.hosts.map(host => host.name + (host.port ? ':' + host.port : ''));
connectionString += hosts.join(',') + '/' + dbConfig.name;

// set Mongoose to use bluebird
mongoose.Promise = Promise;

// log errors
mongoose.connection.on('error', err => logger.error(err));

export default {
  /**
   * Connect to database
   *
   * @return {Promise}
   */
  connect() {
    logger.info('Connecting to ' + connectionString);

    return mongoose.connect(connectionString, {useMongoClient: true});
  },

  disconnect() {
    return mongoose.disconnect();
  },

  connectionString
}


