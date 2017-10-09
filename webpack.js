const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',

  module: {
    rules: [
      {
        test: /\.js/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.jsx/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },

  externals: {
    react: 'React'
  },

  output: {
    filename: 'dist/react-spy.js',
    libraryTarget: 'umd',
    library: 'reactSpy'
  },

  resolve: {
    extensions: ['.jsx', '.js']
  }
};