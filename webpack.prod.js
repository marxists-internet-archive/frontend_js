const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    filename: "script.js",
    path: path.resolve(__dirname, "build")
  },
  module: {
    rules: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        }
      }
    }]
  },
  plugins: [
    new CopyPlugin([{
        from: "./src/assets/css/js_style.css",
        to: "./[name].css"
      },
      {
        from: "./src/assets/js-img",
        to: "./assets/js-img"
      }
    ]),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: true
        }
      })
    ]
  }
};