/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    esmExternals: false,
  },
  images: {
    domains:['s1.eda.ru'],
    remotePatterns: [
      {
        protocol: "https",
        pathname: "/StaticContent/Photos/**",
        hostname: "**.s1.eda.ru",
        port: "",
      },
      {
        protocol: "https",
        pathname: "/**",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        pathname: "/**",
        hostname: "uploadthing.com",
        port: "",
      },
    ],
    formats:['image/webp']
  },
  reactStrictMode: true,

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

export default config;
