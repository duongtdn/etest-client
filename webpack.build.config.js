"use strict"

const path = require("path");

module.exports = {
  entry: {
    exam: ['./src/scripts/exam.js'],
    result: ['./src/scripts/result.js']
  },
  output: {
    path: path.resolve(__dirname, "build/"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /(\.js?$)|(\.jsx?$)/,
        use: 'babel-loader',
      }
    ]
  },
  mode: 'development',
  devtool: 'inline-source-map'
}
