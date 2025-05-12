const path = require('path');

module.exports = {
  entry: './ts/main.ts',
  mode: "development",
//   devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: path.resolve(__dirname, "ts"),
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    pathinfo: true,
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'lib'),
  },
};