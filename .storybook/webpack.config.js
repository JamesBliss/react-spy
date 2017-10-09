const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'raw-loader', 'sass-loader'],
        include: [
          path.resolve(__dirname, './'),
          path.resolve(__dirname, '../css/'),
        ],
      },
      {
        test: /\.md$/,
        use: 'raw-loader'
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
