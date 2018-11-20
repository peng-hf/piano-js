const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = (_, argv) => ({
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  devtool: argv.mode === 'development' ? 'eval-source-map' : false, // enhance the debugging process
  resolve: {
    alias: {
      '@': path.resolve('src'),
      '@assets': path.resolve('assets')
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre', // Force this rule to be execute first
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['eslint-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader', // If css loader extraction fails (on dev mode), fallback to style-loader
          use: [
            { loader: 'css-loader', options: { minimize: argv.mode !== 'development' } },
            'sass-loader'
          ]
        })
      },
      {
        test: /\.(ttf|eot|woff|woff2|mp3)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][hash].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin({
      filename: '[name].[hash].css',
      disable: argv.mode === 'development' // disable extract css to a file on dev mode
    }),
    new HtmlWebpackPlugin({
      title: 'Piano JS',
      template: path.resolve(__dirname, 'index.html')
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: __dirname,
    overlay: true, // show errors in the console term
    hot: true
  }
})

module.exports = config
