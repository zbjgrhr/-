import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  // Review servers can opt into an isolated cache so a production build never
  // replaces chunks that an already-running development server still expects.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(process.cwd(), "src");
    return config;
  },
};

export default nextConfig;
