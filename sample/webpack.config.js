const HtmlWebPackPlugin = require('html-webpack-plugin')

const htmlPlugin = new HtmlWebPackPlugin({
  filename: './index.html',
  template: './src/index.html',
})

const rules = [
  {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  },
]

module.exports = {
  module: {
    rules,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [htmlPlugin],
}
