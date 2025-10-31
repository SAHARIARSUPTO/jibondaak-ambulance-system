/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.pollinations.ai",
      },
      {
        protocol: "https",
        hostname: "user-gen-media-assets.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
