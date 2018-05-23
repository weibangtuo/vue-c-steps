module.exports = {
  configureWebpack: config => {
    delete config.entry
    return {
      entry: {
        'app-demo': './src/main.js'
      },
      output: {
        filename: '[name].js',
        publicPath: './',
        chunkFilename: '[name].js'
      }
    }
  }
}
