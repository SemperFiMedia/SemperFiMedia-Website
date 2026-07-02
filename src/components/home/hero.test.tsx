import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
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

  it('defers the showreel video until a real user gesture', () => {
    const { container } = render(<Hero />);
    // Untrusted (synthetic) events must NOT mount the video — Lighthouse fix.
    act(() => {
      window.dispatchEvent(new Event('pointerdown'));
    });
    expect(container.querySelector('video')).toBeNull();
  });

  it('mounts the showreel video after a trusted gesture', async () => {
    // `isTrusted` is unforgeable in jsdom, so capture the gesture listener
    // and invoke it directly with a trusted-looking event.
    const added: [string, EventListener][] = [];
    const spy = vi
      .spyOn(window, 'addEventListener')
      .mockImplementation((type: string, handler: EventListenerOrEventListenerObject) => {
        added.push([type, handler as EventListener]);
      });
    const { container } = render(<Hero />);
    spy.mockRestore();

    const gestureHandler = added.find(([type]) => type === 'pointerdown')?.[1];
    expect(gestureHandler).toBeDefined();
    act(() => {
      gestureHandler!({ isTrusted: true } as Event);
    });
    await waitFor(() => {
      expect(container.querySelector('video')).toBeInTheDocument();
    });
    expect(container.querySelector('video')).toHaveAttribute(
      'src',
      '/videos/hero-showreel.mp4',
    );
  });
});
