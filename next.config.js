/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  headers: async () => {
    return [
      {
        // Adding CORS headers for /manifest.json
        source: "/manifest.json",
        locale: false,
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://app.safe.global",
          },
          { key: "Access-Control-Allow-Methods", value: "GET" },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, content-type, Authorization",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
