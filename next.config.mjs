/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/personalwebsite' : '';

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath,
};

export default nextConfig;
