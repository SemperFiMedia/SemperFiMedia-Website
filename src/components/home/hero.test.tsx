import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/components/media/cinematic-video', () => ({
  CinematicVideo: () => <div data-testid="mux-video" />,
}));

import { Hero } from './hero';

describe('Hero', () => {
  it('renders brand headline', () => {
    render(<Hero showreelPlaybackId="abc" />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent(/always faithful/i);
    expect(h1).toHaveTextContent(/to your story/i);
  });

  it('renders dual CTAs', () => {
    render(<Hero showreelPlaybackId="abc" />);
    expect(screen.getByRole('link', { name: /see the work/i })).toHaveAttribute('href', '/work');
    expect(screen.getByRole('link', { name: /book a call/i })).toHaveAttribute('href', '/contact');
  });

  it('renders showreel video when playback id present', () => {
    render(<Hero showreelPlaybackId="abc" />);
    expect(screen.getByTestId('mux-video')).toBeInTheDocument();
  });
});
