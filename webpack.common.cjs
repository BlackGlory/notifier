const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  target: 'web'
, entry: {
    'app': './src/renderer/app.tsx'
  , 'notification': './src/renderer/notification.tsx'
  }
, output: {
    path: path.join(__dirname, 'dist')
  , filename: '[name].js'
  }
, resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  , plugins: [new TsconfigPathsPlugin()]
  , extensionAlias: {
      '.js': ['.js', '.ts']
    , '.jsx': ['.jsx', '.tsx']
    , '.cjs': ['.cjs', '.cts']
    , '.mjs': ['.mjs', '.mts']
    }
  }
, module: {
    rules: [
      {
        test: /\.([cm]?ts|tsx)$/
      , use: 'ts-loader'
      }
    , {
        test: /\.css$/i
      , use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  }
, plugins: []
}
