/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    // Modern config (replaces deprecated images.domains)
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|png|jpg|jpeg|webp|ico)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/article/:slug",
        destination: "/news/:slug",
        permanent: true,
      },
    ];
  },
  // ⚠️ Emergency-only: let builds pass even with TS errors
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

module.exports = nextConfig;
