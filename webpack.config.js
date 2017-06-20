const nodeExternals = require('webpack-node-externals');
const path = require('path');

const serverConfig = {
  target: 'node',
  externals: [nodeExternals()],
  entry: {
    'index': './src/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
}

const clientConfig = {
  target: 'web',
  entry: {
    'app': ['./public/js/app.js']
  },
  output: {
    path: path.join(__dirname, 'public/bundled'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
}

const chromeExtensionContentScriptConfig = {
  target: 'web',
  entry: {
    'content-script': ['./extchrome/js/content-script.js']
  },
  output: {
    path: path.join(__dirname, 'extchrome/bundled'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
}

const chromeExtensionBackgroundScriptConfig = {
  target: 'web',
  entry: {
    'background-script': ['./extchrome/js/background-script.js']
  },
  output: {
    path: path.join(__dirname, 'extchrome/bundled'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
}

module.exports = [ serverConfig, clientConfig, chromeExtensionContentScriptConfig, chromeExtensionBackgroundScriptConfig ];