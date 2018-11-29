const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function getConfig (_, argv) {
  const common = {
    entry: {
      app: './src/index.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[hash].js'
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
        // Inject main bundle script into headers to load and apply all css styles before browser
        // start parsing body content during webpack dev mode
        inject: argv.mode === 'development' ? 'head' : 'body'
      })
    ]
  }

  const config = Object.assign({}, common)
  if (argv.mode === 'development') {
    config.devtool = 'eval-source-map' // enhance the debugging process
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        { loader: 'sass-loader' }
      ]
    })
    config.plugins = config.plugins.concat([
      new webpack.HotModuleReplacementPlugin()
    ])
    config.devServer = {
      contentBase: __dirname,
      overlay: true, // show errors in the console term
      hot: true
    }
  }

  if (argv.mode === 'production') {
    config.module.rules.push({
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        use: [
          { loader: 'css-loader', options: { minimize: true } },
          'sass-loader'
        ]
      })
    })
    config.plugins = config.plugins.concat([
      new CleanWebpackPlugin(['dist']),
      new ExtractTextPlugin({ filename: '[name].[hash].css' })
    ])
  }

  return config
}

module.exports = getConfig
