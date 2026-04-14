import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';

type Props = {
  videoSrc?: string;
};

export function Hero({ videoSrc = '/videos/hero-showreel.mp4' }: Props) {
  return (
    <section
      className="relative overflow-hidden bg-gunpowder film-grain"
      aria-label="Semper Fi Media showreel"
    >
      <div className="letterbox-top relative z-20" />
      {videoSrc && (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          aria-hidden="true"
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-br from-gunpowder/70 via-dusk-teal/40 to-texas-umber/30 pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto flex min-h-[720px] max-w-[1440px] flex-col justify-center px-6 py-24 md:px-12">
        <DataLabel className="mb-6">
          SCENE 001 · TAKE 01 · ROLL A · FORNEY TX · 32.75°N
        </DataLabel>
        <h1 className="font-serif italic font-bold leading-[0.95] tracking-tight text-6xl md:text-8xl lg:text-9xl max-w-5xl">
          Always Faithful
          <br />
          to Your Story.
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-bone-muted md:text-xl">
          Marine-led cinematic video production based in Dallas. Big-agency quality. Half the
          overhead. One filmmaker, one camera, one mission.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <BrassButton href="/work">See the Work →</BrassButton>
          <BrassButton href="/contact" variant="outline">
            Book a Call
          </BrassButton>
        </div>
      </div>
      <div className="letterbox-bottom relative z-20" />
    </section>
  );
}
