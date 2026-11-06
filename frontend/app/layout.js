import './globals.css';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'PathFinders — Where Dreams Meet Direction',
  description:
    'AI-powered career counselling that reads your academics, interests, and personality, then walks the route with you — camp by camp, to the summit.',
  keywords: ['career guidance', 'AI counselling', 'student portals', 'career switch', 'education planning'],
  authors: [{ name: 'PathFinders Team' }],
  alternates: {
    canonical: 'https://pathfinders.ai',
    languages: {
      'en': 'https://pathfinders.ai',
      'hi': 'https://pathfinders.ai/?lang=hi',
      'or': 'https://pathfinders.ai/?lang=or',
      'bn': 'https://pathfinders.ai/?lang=bn',
      'te': 'https://pathfinders.ai/?lang=te',
      'mr': 'https://pathfinders.ai/?lang=mr',
      'gu': 'https://pathfinders.ai/?lang=gu',
      'ur': 'https://pathfinders.ai/?lang=ur',
      'kn': 'https://pathfinders.ai/?lang=kn',
      'ml': 'https://pathfinders.ai/?lang=ml',
    },
  },
  openGraph: {
    title: 'PathFinders — Where Dreams Meet Direction | AI Career Counselling',
    description:
      'AI-powered career counselling that reads your academics, interests, and personality, then walks the route with you.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'PathFinders',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PathFinders — Where Dreams Meet Direction',
    description:
      'AI-powered career counselling that reads your academics, interests, and personality, then walks the route with you.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-parchment text-charcoal font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
