import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@mux/mux-player-react', () => ({
  default: (props: Record<string, unknown>) => (
    <div data-testid="mux-player" data-playback-id={props.playbackId as string} />
  ),
}));

import { CinematicVideo } from './cinematic-video';

describe('CinematicVideo', () => {
  it('passes playback id to Mux player', () => {
    render(<CinematicVideo playbackId="abc123" title="Test Film" />);
    expect(screen.getByTestId('mux-player')).toHaveAttribute('data-playback-id', 'abc123');
  });
});
