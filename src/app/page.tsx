import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { Hero } from '@/components/home/hero';
import { PositioningStrip } from '@/components/home/positioning-strip';
import { FeaturedWork } from '@/components/home/featured-work';
import { DualFunnel } from '@/components/home/dual-funnel';
import { FlagshipSpotlight } from '@/components/home/flagship-spotlight';
import { FounderStrip } from '@/components/home/founder-strip';
import { TestimonialFeature } from '@/components/home/testimonial-feature';
import { LogoWall } from '@/components/home/logo-wall';
import { CtaCloser } from '@/components/home/cta-closer';
import { SocialReelsPitch } from '@/components/home/social-reels-pitch';
import {
  getFeaturedCaseStudies,
  getFeaturedTestimonials,
  getFeaturedClients,
  getSocialReels,
} from '@/sanity/queries';

export default async function HomePage() {
  const [caseStudies, testimonials, clients, socialReels] = await Promise.all([
    getFeaturedCaseStudies(6),
    getFeaturedTestimonials(),
    getFeaturedClients(),
    getSocialReels(3),
  ]);

  const featuredTestimonial = testimonials[0];

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <PositioningStrip />
        {caseStudies.length > 0 && <FeaturedWork caseStudies={caseStudies} />}
        <DualFunnel />
        <SocialReelsPitch reels={socialReels} />
        <FlagshipSpotlight />
        {featuredTestimonial && <TestimonialFeature testimonial={featuredTestimonial} />}
        {clients.length > 0 && <LogoWall clients={clients} />}
        <FounderStrip />
        <CtaCloser />
      </main>
      <Footer />
    </>
  );
}
