import type { NextConfig } from "next";
import { domain } from '@Calendis/config/app';
import { headers } from '@Calendis/config/security';

const nextConfig: NextConfig = {
  distDir: 'dist',
  reactCompiler: true,
	devIndicators: false,
	allowedDevOrigins: [domain.www.development, domain.app.development, domain.demo.development],
	poweredByHeader: false,
	async headers() {
		return [
			{
				source: '/(.*)',
				headers
			}
		]
	}
};

export default nextConfig;
