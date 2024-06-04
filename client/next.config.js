module.exports = {
    reactStrictMode: true,
    webpackDevMiddleware: config => {
      config.watchOptions = {
        poll: 100,  // ポーリング間隔を100ミリ秒に設定
        aggregateTimeout: 300,
      }
      return config
    },
  }