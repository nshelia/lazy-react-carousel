const path = require('path');
const webpack = require('webpack')

module.exports = (env) => {
  const isDev = env.target === 'production'

  return {
    mode: isDev ? 'development' : 'production',
    entry: {
      index: "./main.js"
    },
    output: {
      path: path.resolve(__dirname, "./dist"), 
      filename: "[name].bundle.js",
      publicPath: '/build/', 
    },
    resolve: {
      extensions: [".js",".json"],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
    devServer: {
      port: 3000,
      open: true,
      compress: true, 
      https: false, 
      historyApiFallback: true
    }
  }
}
