import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DataLabel } from './data-label';
import { BrassButton } from './brass-button';

describe('DataLabel', () => {
  it('renders children', () => {
    render(<DataLabel>SCENE 001</DataLabel>);
    expect(screen.getByText('SCENE 001')).toBeInTheDocument();
  });

  it('applies data-label class', () => {
    render(<DataLabel>TEST</DataLabel>);
    expect(screen.getByText('TEST')).toHaveClass('data-label');
  });
});

describe('BrassButton', () => {
  it('renders as anchor when href provided', () => {
    render(<BrassButton href="/contact">Book</BrassButton>);
    expect(screen.getByRole('link', { name: /book/i })).toHaveAttribute('href', '/contact');
  });

  it('renders as button and fires onClick', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<BrassButton onClick={onClick}>Click Me</BrassButton>);
    await user.click(screen.getByRole('button', { name: /click me/i }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
