'use strict'

const path = require('path');
const os = require('os');
const fs = require('fs');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const _ = require('lodash');
const chalk = require('chalk');
const statsPlugin = require("webpack-stats-plugin");

const config = require('./config');
const babelrc = JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc')));

// class LogBuildPlugin {
//     apply(compiler) {
//         function log(message) {
//             const now = new Date();
//             const nowString = [now.getHours(), now.getMinutes(), now.getSeconds()].map(t => t < 10 ? '0' + t : t).join(':');
//             console.log(`[${nowString}]`, message);
//         }
//
//         // see https://github.com/webpack/docs/wiki/plugins
//         compiler.plugin('watch-run', (watching, cb) => {
//             log(chalk.yellow('webpack building...'));
//             cb();
//         });
//
//         compiler.plugin('done', stats => {
//             let time = stats.endTime - stats.startTime;
//             let units = 'ms';
//             if (time > 1000) {
//                 time = Math.round(time/100)/10;
//                 units = 's';
//             }
//             const assets = _.keys(stats.compilation.assets);
//             const grouped = _.groupBy(assets, name => name.substr(name.indexOf('.', 5)));
//             const counts = _.map(grouped, (group, suffix) => group.length + ' x ' + suffix);
//             log(chalk.yellow(`built ${stats.hash} with ${assets.length} assets in ${time + units}\n ` + counts.join('\n ')));
//         });
//     };
// }

function hotreload(val) {
  return config.webpack.hotreload ? val : null;
}

module.exports = {
  context: __dirname,
  devtool: 'cheap-module-eval-source-map',
  entry: _.filter([
    hotreload('webpack-hot-middleware/client'),
    './src/client.js'
  ]),
  output: {
    path: path.join(__dirname, '/static/dist'),
    filename: 'app-[hash].js',
    publicPath: '/static/'
  },
  plugins: _.filter([
    hotreload(new webpack.HotModuleReplacementPlugin()),
    new ProgressBarPlugin({ summary: false }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new statsPlugin.StatsWriterPlugin({
      filename: 'webpack-assets.json'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        APP: JSON.stringify(require('./config')),
        CLIENT: true
      }
    }),
    new CleanPlugin('static/dist/*', {
      verbose: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    })
    // new LogBuildPlugin()
  ]),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: _.merge(babelrc, {
            // `os.tmpdir()` would seem better, but inside docker it returned /app
            cacheDirectory: os.platform() === 'linux' ? '/tmp/' : true,
            env: {
              development: {
                presets: ["react-hmre"]
              }
            }
          })
        },
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: true,
              minimize: false
            }
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: true,
              sourceMapContents: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: (loader) => [
                require('autoprefixer')()
              ]
            }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?.*)?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?.*)?$/,
        use: 'file-loader'
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.png$/,
        use: 'url-loader?limit=10000'
      }
    ]
  }
};
