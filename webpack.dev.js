const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
var CleanObsoleteChunks = require("webpack-clean-obsolete-chunks");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "script.[contentHash].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./html/index.html" }),
    new CopyPlugin([
      { from: "./html/assets", to: "./assets" },
      { from: "./html/style.css" }
    ]),
    new CleanObsoleteChunks()
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};
