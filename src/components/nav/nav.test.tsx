import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Nav } from './nav';

describe('Nav', () => {
  it('renders brand wordmark', () => {
    render(<Nav />);
    expect(screen.getByText(/Semper Fi/i)).toBeInTheDocument();
  });

  it('renders primary nav links', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: /work/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /corporate/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /weddings/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  it('renders a Book a Call CTA that links to /contact', () => {
    render(<Nav />);
    const cta = screen.getByRole('link', { name: /book a call/i });
    expect(cta).toHaveAttribute('href', '/contact');
  });
});
