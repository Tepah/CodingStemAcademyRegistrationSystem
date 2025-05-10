/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BACKEND_URL: process.env.BACKEND_URL || 'http://127.0.0.1:5000',
    },
};

export default nextConfig;
