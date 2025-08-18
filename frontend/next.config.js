/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: { domains: ["images.unsplash.com"] },
  // ⚠️ Emergency-only: let builds pass even with TS errors
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

module.exports = nextConfig;
