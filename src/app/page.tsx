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
import { ProcessSection } from '@/components/home/process-section';
import { FaqSection } from '@/components/home/faq-section';
import { Reveal } from '@/components/primitives/reveal';
import {
  getFeaturedCaseStudies,
  getFeaturedTestimonials,
  getFeaturedClients,
  getSocialReels,
  getHeroCaseStudy,
} from '@/sanity/queries';
import { urlForImage } from '@/sanity/image';

export default async function HomePage() {
  const [caseStudies, testimonials, clients, socialReels, heroCs] = await Promise.all([
    getFeaturedCaseStudies(6),
    getFeaturedTestimonials(),
    getFeaturedClients(),
    getSocialReels(3),
    getHeroCaseStudy(),
  ]);

  const featuredTestimonial = testimonials[0];
  const heroPosterUrl = heroCs?.poster
    ? urlForImage(heroCs.poster)?.width(1920).height(1080).url() ?? undefined
    : undefined;

  return (
    <>
      <Nav />
      <main>
        <Hero muxPlaybackId={heroCs?.muxPlaybackId} posterUrl={heroPosterUrl} />
        <Reveal>
          <PositioningStrip />
        </Reveal>
        {caseStudies.length > 0 && (
          <Reveal>
            <FeaturedWork caseStudies={caseStudies} />
          </Reveal>
        )}
        <Reveal>
          <DualFunnel />
        </Reveal>
        <SocialReelsPitch reels={socialReels} />
        <Reveal>
          <FlagshipSpotlight />
        </Reveal>
        <ProcessSection />
        {featuredTestimonial && (
          <Reveal>
            <TestimonialFeature testimonial={featuredTestimonial} />
          </Reveal>
        )}
        {clients.length > 0 && (
          <Reveal>
            <LogoWall clients={clients} />
          </Reveal>
        )}
        <Reveal>
          <FounderStrip />
        </Reveal>
        <FaqSection />
        <Reveal>
          <CtaCloser />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
