import express from 'express';
import compression from 'compression';
import path from 'path';
import webpack from 'webpack';
import bodyParser from 'body-parser';
import expressWinston from 'express-winston';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import React from 'react';
import logger from 'winston';
import chalk from 'chalk';
import { renderToStaticMarkup } from 'react-dom/server';

import config from '../config';
import HTML from './components/HTML';
import db from './mongo/db';
import apiRouter from './api';
import HttpError from './util/HttpError';

const app = express();

logger.info(`In ${process.env.NODE_ENV} mode`);
logger.info(`Using config "${config.name}" (${config.configFiles.join(' < ')})`);
logger.info(JSON.stringify(config));

if (config.webpack.hotreload) {
  const webpackConfig = require('../webpack.config');
  const compiler = webpack(webpackConfig);

  const devMiddlewareOptions = {
    serverSideRender: true,
    publicPath: webpackConfig.output.publicPath,
    noInfo: true
  };

  if (config.webpack.poll) {
    devMiddlewareOptions.watchOptions = {
      aggregateTimeout: 300,
      poll: true
    };
  }

  app.use(webpackDevMiddleware(compiler, devMiddlewareOptions));
  app.use(webpackHotMiddleware(compiler, {reload: true, log: false}));
}

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Disable X-Powered-By header
app.disable('x-powered-by');

// setup static assets before session-related logic
app.use('/static', express.static(path.resolve(__dirname, '../static/dist')));
app.use('/img', express.static(path.resolve(__dirname, '../static/img')));

// Only log non-static resources.
app.use(expressWinston.logger({
  winstonInstance: logger,
  expressFormat: true,
  colorize: true,
  meta: false
}));

// handle API calls
app.use('/api', apiRouter);

// show the single-page app for everything else
app.use((req, res, next) => {
  const assets = config.webpack.hotreload
    // dev, provided by `webpack-dev-middleware`
    ? res.locals.webpackStats.toJson()
    // prod, built by `build` npm script
    : require('../static/dist/webpack-assets.json');

  const body = renderToStaticMarkup(<HTML assets={assets.assetsByChunkName} />);
  res.status(200).send(`<!doctype html>\n${body}`);
});

// add error handling
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  if (statusCode === 500) {
    logger.error(err);
  } else {
    logger.warn(err.message);
  }
  const error = {
    message: err.message || 'Unknown error'
  };
  res.status(statusCode).send(error);
});

db.connect()
  .then(() => {
    logger.info('Connected');

    app
      .listen(config.port, '0.0.0.0', () => {
        logger.info('Running on port ' + config.port);
      })
      .on('error', error => {
        if (error.code === 'EADDRINUSE') {
          logger.error(`Cannot run: port ${config.port} already in use`);
        } else {
          logger.error(error);
        }
        process.exit(1);
      });
  });
