export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pathfinders.ai';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/language', '/login', '/register', '/careers/'],
        disallow: [
          '/dashboard',
          '/student-dashboard',
          '/parent-dashboard',
          '/career-switcher-dashboard',
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

