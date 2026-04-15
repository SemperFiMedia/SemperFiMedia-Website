import { cn } from '@/lib/utils';

type Props = {
  url: string;
  title: string;
  className?: string;
};

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1] ?? null;
  }
  return null;
}

export function YouTubeEmbed({ url, title, className }: Props) {
  const id = extractYouTubeId(url);
  if (!id) return null;

  const src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;

  return (
    <div className={cn('relative aspect-video overflow-hidden bg-gunpowder', className)}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
