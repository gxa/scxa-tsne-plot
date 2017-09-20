var webpack = require('webpack');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    tSnePlotDemo: ['whatwg-fetch', 'babel-polyfill', './html/Demo.js'],
    dependencies: ['color', 'prop-types', 'react', 'react-dom', 'react-highcharts', 'recompose', 'urijs']
  },

  output: {
    library: '[name]',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/html/'
  },

  plugins: [
    new CleanWebpackPlugin(['dist'], {verbose: true, dry: false}),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'dependencies',
      filename: 'vendorCommons.bundle.js',
      minChunks: Infinity     // Explicit definition-based split, see dependencies entry
    })
  ],

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              query: {
                name: '[hash].[ext]',
                hash: 'sha512',
                digest: 'hex'
              }
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              query: {
                bypassOnDebug: true,
                mozjpeg: {
                  progressive: true,
                },
                gifsicle: {
                  interlaced: true,
                },
                optipng: {
                  optimizationLevel: 7,
                }
              }
            }
          }
        ]
      },
      {
        test: /\.svg$/i,
        use: 'file-loader'
      },
      {
        test: /\.js$/i,
        exclude: /node_modules\//,
        use: 'babel-loader'
      }
    ]
  },

  devServer: {
    port: 9000
  }
};

