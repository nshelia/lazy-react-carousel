const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      index: "./dev/index.js"
    },
    output: {
      path: path.resolve(__dirname, "./dist"), 
      filename: "[name].bundle.js"
    },
    resolve: {
      modules: [
        "node_modules",
        "./dev",
      ],
      extensions: [".js",".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader?sourceMap',
            'resolve-url-loader',
            'sass-loader?sourceMap',
            'import-glob-loader'
          ]
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader?sourceMap',
            'resolve-url-loader',
            'import-glob-loader'
          ]
        },
        {
          test: /\.(png|jpg|gif|svg|ico|eot|ttf|woff|woff2)$/,
          loader: 'file-loader'
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Loading...',
        filename: 'index.html',
        template: './dev/template/index.html',
        inject:true
      })
    ],
    devServer: {
      contentBase: path.resolve(__dirname, "./dist"), 
      port: 3000,
      open: true,
      compress: true, 
      https: false, 
      historyApiFallback: true
    }
  }
}
