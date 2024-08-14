const dotenv = require('dotenv');
const path = require('path');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
const envFilePath = path.resolve(__dirname, envFile);
const result = dotenv.config({ path: envFilePath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
  throw result.error;
}

console.log('Environment variables:', process.env.NODE_ENV);
console.log(`Using environment file: ${envFilePath}`);
console.log(`NEXT_PUBLIC_BACKEND_URL: ${process.env.NEXT_PUBLIC_BACKEND_URL}`);
console.log(`NEXT_PUBLIC_FRONTEND_URL: ${process.env.NEXT_PUBLIC_FRONTEND_URL}`);
console.log(`SITE_NAME: ${process.env.SITE_NAME}`);
console.log(`SITE_DESCRIPTION: ${process.env.SITE_DESCRIPTION}`);

// 環境変数の設定を確認するための追加コード
console.log('Loaded environment variables:', result.parsed.SITE_NAME);