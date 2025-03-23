import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamic imports for client components
const HeroContent = dynamic(() => import('@/components/ui/hero-content').then(mod => mod.HeroContent), { ssr: false });
const WhySection = dynamic(() => import('@/components/sections/why-section').then(mod => mod.WhySection), { ssr: false });
const FeaturesSection = dynamic(() => import('@/components/sections/features-section').then(mod => mod.FeaturesSection), { ssr: false });
const StatsSection = dynamic(() => import('@/components/sections/stats-section').then(mod => mod.StatsSection), { ssr: false });
const HowItWorksSection = dynamic(() => import('@/components/sections/how-it-works-section').then(mod => mod.HowItWorksSection), { ssr: false });
const TestimonialsSection = dynamic(() => import('@/components/sections/testimonials-section').then(mod => mod.TestimonialsSection), { ssr: false });
const CTASection = dynamic(() => import('@/components/sections/cta-section').then(mod => mod.CTASection), { ssr: false });

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
      <WhySection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
