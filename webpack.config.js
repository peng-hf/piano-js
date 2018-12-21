const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

function getConfig (_, argv) {
  const devMode = argv.mode !== 'production'
  const common = {
    entry: {
      app: './src/index.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: devMode ? '[name].js' : '[name].[hash].js'
    },
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
          use: 'eslint-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-syntax-dynamic-import']
          }
        },
        {
          test: /.*\.scss/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }
        },
        {
          test: /\.mp3$/,
          use: {
            loader: 'url-loader'
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Piano JS',
        template: path.resolve(__dirname, 'index.html'),
        // On dev mode, main bundle script is injected into html headers to allow css from style-loader
        // to be loaded immediatly before browser start parsing body content
        inject: devMode ? 'head' : 'body'
      })
    ]
  }

  const config = Object.assign({}, common)
  if (devMode) {
    config.devtool = 'eval-source-map' // enhance the debugging process
    config.plugins = config.plugins.concat([new webpack.HotModuleReplacementPlugin()])
    config.devServer = {
      contentBase: __dirname,
      overlay: true, // show errors in the console term
      hot: true
    }
  } else { // Production mode
    config.plugins = config.plugins.concat([
      new CleanWebpackPlugin(['dist']),
      new MiniCssExtractPlugin({ filename: '[name].[hash].css' })
    ])
    // Overrides the defaults provided by webpack, must specify JS minimizer
    config.optimization = {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin({}) // Minimize css
      ]
    }
  }
  return config
}

module.exports = getConfig
