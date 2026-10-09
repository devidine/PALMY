/** @type {import('next').NextConfig} */
const nextConfig = {
  // If we are deploying to Cloudflare Pages, we might need specific configurations 
  // but next-on-pages handles most of it.
  // We'll leave it simple.
  reactStrictMode: true,
};

module.exports = nextConfig;
