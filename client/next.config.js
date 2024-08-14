module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['www.google.com', 'www.kabudragon.com'],
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
      {
        source: '/dashboard/Category',
        destination: '/dashboard',
        permanent: true,
      },
    ]
  },
}
