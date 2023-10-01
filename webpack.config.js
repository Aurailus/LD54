const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
module.exports = {
  entry: './src/Main.ts',
  module: {
    rules: [
      {
        test: /\.[t|j]sx?$/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          cacheDirectory: true,
          presets: [
            [
              '@babel/preset-typescript',
              {
                isTSX: true,
                allExtensions: true,
                jsxPragma: 'h',
              },
            ],
          ],
          plugins: [['@babel/transform-react-jsx', { pragma: 'h' }]],
        },
      },
      {
        test: /\.png$/,
        type: 'asset/resource'
      },
      {
        test: /\.wav$/,
        type: 'asset/resource'
      },
      {
        test: /\.pcss$/,
        use: [ 'style-loader', 'css-loader', 'postcss-loader' ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
      '@res': path.resolve(__dirname, 'res')
    },
  },
  devServer: {
    host: '0.0.0.0',
    setupMiddlewares: (middlewares, server) => {
      const doc = `
        <!DOCTYPE html>
        <html lang='en'>
          <head>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Darumadrop+One&family=Space+Mono:ital,wght@0,700;1,400&display=swap" rel="stylesheet">
            <style>
              body {
                margin: 0;
              }
              canvas {
                display: block;
              }
            </style>
          </head>
          <body id='root'/>
          <script src='/main.js'></script>
        </html>
      `;

      server.app.get('/', (_, res) => res.send(doc));

      return middlewares;
    },
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build'),
  },
	plugins: [
		new HTMLWebpackPlugin(),
    new ForkTsCheckerPlugin({
      typescript: { configFile: path.resolve(__dirname, 'tsconfig.json') }
    })
	]
};
