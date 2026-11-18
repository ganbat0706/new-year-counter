import type { NextConfig } from "next";

// GitHub Pages-д зориулсан статик export. PPR (Cache Components) нь export
// горимд ажиллахгүй тул зөвхөн энэ build-д унтраана — локал dev/build хэвээр.
const isPages = process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = {
  /* config options here */
  ...(isPages
    ? { output: "export" as const, basePath: "/new-year-counter" }
    : {}),
  cacheComponents: !isPages,
  partialPrefetching: !isPages,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
