const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const UglifyJSPlugin = require('uglify-js-plugin')
const dev = process.env.NODE_ENV === 'dev'
const webpack = require('webpack')

let config = {
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve('dist'),
    publicPath: '/dist/',
    filename: '[name].bundle.js'
  },
  devtool: dev ? 'eval-source-map' : false, // enhance the debugging process
  resolve: {
    alias: {
      '@': path.resolve('src'),
      '@css': path.resolve('assets/styles')
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
          presets: [
            ['env', {
              targets: {
                // Ship native es6 on last 2 version of all browser and safari >= 7
                'browsers': ['last 2 versions', 'safari >= 7']
              }
            }]
          ]
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader', // If extraction fails (on dev mode for ex), use style-loader
          use: [
            { loader: 'css-loader', options: { minimize: !dev } },
            'sass-loader'
          ]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].styles.css',
      disable: dev // disable extract css to a file on dev mode
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: __dirname,
    overlay: true, // show errors in the console term
    hot: true
  }
}

if (!dev) {
  config.plugins.push(
    new UglifyJSPlugin()
  )
}

module.exports = config
