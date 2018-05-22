module.exports = {
  configureWebpack: config => {
    delete config.entry
    var isProd = process.env.NODE_ENV === 'production'
    return {
      entry: {
        'vue-c-steps': [isProd ? './index.js' : './src/main.js']
      },
      output: {
        filename: '[name].min.js',
        publicPath: './',
        chunkFilename: '[name].min.js'
      }
    }
  }
}
