/* eslint-disable @typescript-eslint/no-var-requires */

// Require
const { resolve } = require('path');

const buildPath = resolve(__dirname, 'build');
const mainPath = resolve(__dirname, 'src', 'index.tsx');

// Webpack Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { WebpackPluginServe } = require('webpack-plugin-serve');

const config = {
  mode: 'development',
  entry: [mainPath, 'webpack-plugin-serve/client'],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: resolve(__dirname, 'build'),
    inline: true,
    publicPath: '/',
    port: 8080,
    historyApiFallback: true,
  },
  output: {
    path: buildPath,
    publicPath: '/',
    filename: 'js/bundle.js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              sourceMap: true,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.([jt]sx?)?$/,
        use: 'swc-loader',
        exclude: /node_modules/,
      },
      {
        exclude: [/(^|\.(svg|css|json|js|jsx|ts|tsx|html))$/],
        type: 'asset/inline',
      },
    ],
  },
  plugins: [
    new WebpackPluginServe({
      hmr: 'refresh-on-failure',
      port: 3000,
      static: buildPath,
    }),
    new ESLintPlugin({
      extensions: ['js', 'ts', 'tsx'],
      cache: true,
      files: './src',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/',
          to: '[name].[ext]',
        },
      ],
    }),
    new HtmlWebpackPlugin({ inject: true, template: './src/index.html' }),
  ],
  watch: true,
};

module.exports = config;
