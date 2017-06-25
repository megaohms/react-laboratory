module.exports = {
  entry: './index.js',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    filename: 'bundle.js',
    publicPath: ''
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react']
          }
        }]
      }
    ]
  }
};