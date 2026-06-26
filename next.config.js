/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // pdfkit reads font/binary files from disk via Node's `fs` at runtime.
  // Bundling it with webpack breaks those internal asset paths and causes the
  // PDF export route to crash on Vercel. Marking it external fixes this.
  serverExternalPackages: ['pdfkit'],
};

module.exports = nextConfig;
