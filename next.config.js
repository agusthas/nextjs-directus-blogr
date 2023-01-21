/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["5ru1zdqh.directus.app", "api.dicebear.com"],
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;
