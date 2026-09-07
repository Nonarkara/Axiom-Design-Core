import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Disc } from '../components/Disc';

describe('Disc', () => {
  it('renders the identity disc with the default blue', () => {
    render(<Disc>A</Disc>);
    const disc = screen.getByText('A');
    expect(disc).toHaveClass('ax-disc');
  });

  it('renders the ink variant in greyscale', () => {
    render(<Disc tone="ink">i</Disc>);
    const disc = screen.getByText('i');
    expect(disc.style.background).toBe('var(--ink)');
    expect(disc.style.color).toBe('var(--paper)');
  });

  it('supports size="lg"', () => {
    render(<Disc size="lg">NYCTA</Disc>);
    const disc = screen.getByText('NYCTA');
    expect(disc).toHaveClass('ax-disc--lg');
  });
});
