/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'jare.storage.c2.liara.space',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'trustseal.enamad.ir',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
