// import { process } from 'next/env'
// const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  reactStrictMode: true,
  experimental: {
    // appDir: !isProd,
  },
  images: {
    domains: ['www.google.com', 'www.kabudragon.com'],
  },
  // webpackDevMiddleware: config => {
  //   if (!isProd) {
  //     config.watchOptions = {
  //       poll: 1000, //チェック時間を増やす
  //       aggregateTimeout: 300, // 遅延時間を減らす
  //       ignored: ["node_modules"],
  //     }
  //   }
  //   return config
  // },
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
      {
        source: '/dashboard/Category',
        destination: '/dashboard',
        permanent: true,
      },
    ]
  },
}
