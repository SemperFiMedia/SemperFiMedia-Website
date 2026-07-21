import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@mux/mux-player-react', () => ({
  default: (props: Record<string, unknown>) => (
    <div data-testid="mux-player" data-playback-id={props.playbackId as string} />
  ),
}));

import { FeaturedMusicVideo, FEATURED_VIDEO_PLAYBACK_ID } from './featured-music-video';

describe('FeaturedMusicVideo', () => {
  it('renders the featured film title and artist', () => {
    render(<FeaturedMusicVideo />);
    // Title + artist both also appear in the mandated description paragraph,
    // so scope this assertion to the heading to keep the query unambiguous.
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(/cut up/i);
    expect(heading).toHaveTextContent(/cole/i);
  });

  it('renders the Mux player with the featured playback id', () => {
    render(<FeaturedMusicVideo />);
    expect(screen.getByTestId('mux-player')).toHaveAttribute(
      'data-playback-id',
      FEATURED_VIDEO_PLAYBACK_ID,
    );
  });

  it('links to the music video service page', () => {
    render(<FeaturedMusicVideo />);
    const cta = screen.getByRole('link', { name: /music video work/i });
    expect(cta).toHaveAttribute('href', '/corporate/music-videos');
  });
});
