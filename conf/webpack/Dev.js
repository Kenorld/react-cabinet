'use strict';

/**
 * Default dev server configuration.
 */
const webpack = require('webpack');
const WebpackBaseConfig = require('./Base');

class WebpackDevConfig extends WebpackBaseConfig {

  constructor() {
    super();
    this.config = {
      devtool: 'cheap-module-source-map',
      entry: [
        './index.js'
      ],
      // plugins: [
      //   new webpack.HotModuleReplacementPlugin(),
      //   new webpack.NoErrorsPlugin()
      // ]
    };
  }
}

module.exports = WebpackDevConfig;
