import { LANGUAGES } from '@/lib/i18n/languages';
import { getAllCareerCards } from '@/lib/careerCardsData';

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pathfinders.ai';

  const publicRoutes = [
    '',
    '/language',
    '/login',
    '/register',
    '/academic-background',
    '/rapid-fire',
  ];

  // Include reviewed career cards (drafts are not indexed)
  const reviewedCareers = getAllCareerCards().filter((c) => c.reviewStatus === 'reviewed');
  reviewedCareers.forEach((career) => {
    publicRoutes.push(`/careers/${career.slug}`);
  });

  const entries = [];

  publicRoutes.forEach((route) => {
    // Default entry
    entries.push({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: route === '' ? 1.0 : 0.8,
      alternates: {
        languages: LANGUAGES.reduce((acc, lang) => {
          acc[lang.code] = `${baseUrl}${route}${route ? '' : '/'}?lang=${lang.code}`;
          return acc;
        }, {}),
      },
    });

    // Language-specific entries for all five release languages
    LANGUAGES.forEach((lang) => {
      entries.push({
        url: `${baseUrl}${route}${route ? '' : '/'}?lang=${lang.code}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 0.9 : 0.7,
      });
    });
  });

  return entries;
}

