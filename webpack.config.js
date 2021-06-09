const path = require('path')

const rules = [
  {
    exclude: /node_modules/,
    test: /\.j|tsx?$/,
    use: {
      loader: 'babel-loader',
    },
  },
  {
    loader: require.resolve('arraybuffer-loader'),
    test: /\.bin$/,
  },
  {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  },
]

module.exports = {
  devtool: 'source-map',
  entry: './src/index.ts',
  module: {
    rules,
  },
  output: {
    filename: 'react-gbajs.js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, './dist'),
    sourceMapFilename: 'react-gbajs.js.map',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  externals: {
    react: 'react',
  },
}
