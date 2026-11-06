import { notFound } from 'next/navigation';
import { getCareerCard, getAllCareerCardSlugs } from '@/lib/careerCardsData';
import { LANGUAGES } from '@/lib/i18n/languages';
import CareerCardTemplate from '@/components/CareerCardTemplate';

export async function generateStaticParams() {
  const slugs = getAllCareerCardSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const career = getCareerCard(resolvedParams?.slug);

  if (!career) {
    return {
      title: 'Career Not Found | PathFinders',
      description: 'The requested career pathway is not available.',
      robots: { index: false, follow: false },
    };
  }

  const isDraft = career.reviewStatus === 'draft';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pathfinders.ai';

  return {
    title: `${career.title} Career Card | PathFinders`,
    description: career.summary || career.tagline,
    keywords: [
      career.title,
      career.category,
      'career guidance',
      'entrance exams',
      'study pathway',
      'degree requirements',
    ],
    // Draft entries are never indexed; reviewed entries are public and indexed
    robots: isDraft
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: `${siteUrl}/careers/${career.slug}`,
      languages: LANGUAGES.reduce(
        (acc, lang) => {
          acc[lang.code] = `${siteUrl}/careers/${career.slug}?lang=${lang.code}`;
          return acc;
        },
        { en: `${siteUrl}/careers/${career.slug}` }
      ),
    },
    openGraph: {
      title: `${career.title} — Career Pathway & Entry Requirements`,
      description: career.summary || career.tagline,
      type: 'article',
      url: `${siteUrl}/careers/${career.slug}`,
    },
  };
}

export default async function CareerPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const career = getCareerCard(resolvedParams?.slug);

  if (!career) {
    notFound();
  }

  return <CareerCardTemplate career={career} initialLang={resolvedSearchParams?.lang} />;
}
