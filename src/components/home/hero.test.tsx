import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from './hero';

describe('Hero', () => {
  it('renders brand headline', () => {
    render(<Hero />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent(/always faithful/i);
    expect(h1).toHaveTextContent(/to your story/i);
  });

  it('renders dual CTAs', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: /see the work/i })).toHaveAttribute('href', '/work');
    expect(screen.getByRole('link', { name: /book a call/i })).toHaveAttribute('href', '/contact');
  });

  it('renders background showreel video', () => {
    const { container } = render(<Hero />);
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', '/videos/hero-showreel.mp4');
  });
});
