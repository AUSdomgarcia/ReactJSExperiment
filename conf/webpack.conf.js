const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FailPlugin = require('webpack-fail-plugin');
const autoprefixer = require('autoprefixer');
// Experiment
// const Webpack_isomorphic_tools_plugin = require('webpack-isomorphic-tools/plugin');
      // Webpack_isomorphic_tools_plugin = new Webpack_isomorphic_tools_plugin(require('./webpack-isomorphic-tools-configuration')).developmet();
    
module.exports = {
  module: {
    loaders: [
      {
        test: /.json$/,
        loaders: [
          'json-loader'
        ]
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader?babel-eslint',
        enforce: 'pre'
      },
      {
        test: /\.(css|scss)$/,
        loaders: [
          'style-loader',
          'css-loader',
          'sass-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'react-hot-loader',
          'babel-loader'
        ]
      },
      // Fonts
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loaders: ['url-loader?limit=10000&mimetype=application/font-woff']
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, 
        loaders: ['url-loader?limit=10000&mimetype=application/font-woff']
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
        loaders: ['url-loader?limit=10000&mimetype=application/octet-stream']
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
        loaders: ['file-loader']
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
        loaders: ['url-loader?limit=10000&mimetype=image/svg+xml']
      }
      // {
      //   test: Webpack_isomorphic_tools_plugin.regular_expression('images'), 
      //   loaders: ['url-loader?limit=10240']
      // }
    ]
  },
  plugins: [
    // Webpack_isomorphic_tools_plugin,
    new webpack.optimize.OccurrenceOrderPlugin(),

    new webpack.NoErrorsPlugin(),

    FailPlugin,

    new HtmlWebpackPlugin({
      template: conf.path.src('index.html')
    }),

    new webpack.HotModuleReplacementPlugin(),

    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: () => [autoprefixer]
      },
      debug: true
    })
  ],

  devtool: 'source-map',
  
  output: {
    path: path.join(process.cwd(), conf.paths.tmp),
    filename: 'index.js'
  },
  
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    `./${conf.path.src('index')}`
  ]
};
