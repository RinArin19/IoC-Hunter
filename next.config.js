/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // pdfkit reads font/binary files from disk via Node's `fs` at runtime.
  // Bundling it with webpack breaks those internal asset paths and causes the
  // PDF export route to crash on Vercel. Marking it external fixes this.
  // Note: in Next.js 14 this lives under `experimental`; it moves to the top
  // level in Next.js 15.
  experimental: {
    serverComponentsExternalPackages: ['pdfkit'],
  },
};

module.exports = nextConfig;
