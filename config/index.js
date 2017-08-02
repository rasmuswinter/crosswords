// use the webpack-generated constant when accessing config on the client
module.exports = process.env.CLIENT
  ? process.env.APP
  : require('./config');