const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ShellPlugin = require('webpack-shell-plugin');

const config = {
  entry: {
    'js/app.js': './assets/js/main.js',
    'css/app.css': './assets/scss/app.scss',
  },
  output: {
    path: path.resolve(__dirname, './src'),
    filename: '[name]',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: { url: false }
            },
            {
              loader: 'sass-loader'
            }
          ],
        })
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([
      './src/css/*.css',
      './src/js/*.js',
    ]),
    new ExtractTextPlugin('[name]'),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        discardComments: {
          removeAll: true,
        },
      },
    }),
    new ShellPlugin({
      onBuildEnd: [
        'zip -r dist/extension.zip ./src -x "*.git*" -x "*.DS_Store"',
      ],
    }),
  );
}

module.exports = config;
