import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from './footer';

describe('Footer', () => {
  it('displays business phone number', () => {
    render(<Footer />);
    expect(screen.getByText(/817.239.2664/)).toBeInTheDocument();
  });

  it('links to the main service pages', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /corporate video/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cinema weddings/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /music videos/i })).toBeInTheDocument();
  });

  it('shows the Semper Fidelis brand mark', () => {
    render(<Footer />);
    expect(screen.getByText(/Semper Fidelis/i)).toBeInTheDocument();
  });
});
