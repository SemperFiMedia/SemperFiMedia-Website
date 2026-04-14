import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionHeader } from './section-header';

describe('SectionHeader', () => {
  it('renders label, heading, and optional link', () => {
    render(
      <SectionHeader
        label="RECENT WORK"
        title="Selected Films"
        action={{ href: '/work', label: 'View All' }}
      />
    );
    expect(screen.getByText('RECENT WORK')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /selected films/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view all/i })).toHaveAttribute('href', '/work');
  });

  it('renders without action when not provided', () => {
    render(<SectionHeader label="X" title="Y" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
