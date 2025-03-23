import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const HeroContent = dynamic(
  () => import('@/components/ui/hero-content').then(mod => mod.HeroContent),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'Make More Reviews - Automate & Analyze Customer Feedback',
  description: 'Transform your customer feedback process with Make More Reviews. Automate collection, gain valuable insights, and showcase reviews effortlessly.',
  keywords: 'customer reviews, review management, feedback automation, business analytics, customer insights',
  openGraph: {
    title: 'Make More Reviews - Automate & Analyze Customer Feedback',
    description: 'Transform your customer feedback process with Make More Reviews. Automate collection, gain valuable insights, and showcase reviews effortlessly.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Make More Reviews Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Make More Reviews - Automate & Analyze Customer Feedback',
    description: 'Transform your customer feedback process. Automate collection, gain insights, and showcase reviews.',
    images: ['/twitter-image.jpg']
  }
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <HeroContent />
      </section>
    </main>
  );
}
