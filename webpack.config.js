var webpack = require("webpack");

module.exports = {
  entry: {
    app: './src/main.js',
    vendor: ['jquery', 'gsap', 'three']
  },
  output: {
    path: './dist',
    filename: 'index.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
  ],
  devServer: {
    inline: true,
    port: 3000
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
}