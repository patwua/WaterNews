/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // ⚠️ Emergency-only: let builds pass even with TS errors
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

module.exports = nextConfig;
