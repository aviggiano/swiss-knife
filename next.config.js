/** @type {import('next').NextConfig} */
const subdomains = require("./subdomains.js");

const nextConfig = {
  reactStrictMode: true,
  headers() {
    return [
      {
        // disable static page generation for api routes
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "s-maxage=0, stale-while-revalidate" },
        ],
      },
    ];
  },
  rewrites() {
    return {
      beforeFiles: [
        // Rewrite for static assets in the public folder
        {
          source: "/chainIcons/:asset*",
          destination: "/chainIcons/:asset*",
        },
        {
          source: "/icon.png",
          destination: "/icon.png",
        },
        // set up subdomains
        ...Object.values(subdomains).map((subdomain) => ({
          source: "/:path((?!_next|chainIcons|icon.png).*)", // Exclude chainIcons from subdomain rewrites
          has: [
            {
              type: "host",
              value: `${subdomain.base}.swiss-knife.xyz`,
            },
          ],
          destination: `/${subdomain.base}/:path*`,
        })),
      ],
    };
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty");
    return config;
  },
  compiler: {
    styledComponents: true,
  },
  experimental: {
    windowHistorySupport: true,
  },
};

module.exports = nextConfig;
