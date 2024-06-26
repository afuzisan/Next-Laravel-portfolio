module.exports = {
  reactStrictMode: true,
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 2000, //チェック時間を増やす
      aggregateTimeout: 300, // 遅延時間を減らす
      ignored: ["node_modules"],
    };
    return config
  },
}