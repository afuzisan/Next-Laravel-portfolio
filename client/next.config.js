module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true, 
  },
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000, //チェック時間を増やす
      aggregateTimeout: 300, // 遅延時間を減らす
      ignored: ["node_modules"],
    };
    return config
  },
  async redirects() {
    return [
      {
        source: '/mypage',
        destination: '/mypage/linkedit',
        permanent: true,
      },
      {
        source: '/stocks',
        destination: '/dashboard',
        permanent: true,
      },
    ]
  },
}