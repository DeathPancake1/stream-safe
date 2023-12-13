/** @type {import('next').NextConfig} */
const DotenvWebpackPlugin = require('dotenv-webpack');
module.exports = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.plugins.push(
      new DotenvWebpackPlugin({
        path: './.env',
        systemvars: true,
      })
    );
    return config
  },
}
