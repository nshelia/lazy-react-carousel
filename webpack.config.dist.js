const path = require('path');
const webpack = require('webpack')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = () => {
  return {
    mode: 'production',
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin({
          cssProcessor: require('cssnano'),
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
          canPrint: true
        })
      ]
    },
    entry: {
      index: './src/index'
    },
    output: {
      path: path.resolve(__dirname, "./dist"),
      library: 'CarouselLib',
      libraryTarget: 'umd', 
      filename: "[name].bundle.js"
    },
    resolve: {
      modules: [
        "node_modules",
        "./dev",
      ],
      extensions: [".js","scss",".jsx"],
    },
    externals: {
      react: {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
      },
      "react-dom": {
        root: "ReactDOM",
        commonjs2: "react-dom",
        commonjs: "react-dom",
        amd: "react-dom"
      }
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
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader?sourceMap',
            'resolve-url-loader',
            'sass-loader?sourceMap',
            'import-glob-loader'
          ]
        },
        {
          test: /\.(png|jpg|gif|svg|ico)$/,
          loader: 'file-loader'
        },
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
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
