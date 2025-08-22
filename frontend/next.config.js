/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["images.unsplash.com", "res.cloudinary.com"],
    formats: ["image/avif", "image/webp"],
  },
  // ⚠️ Emergency-only: let builds pass even with TS errors
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

module.exports = nextConfig;
