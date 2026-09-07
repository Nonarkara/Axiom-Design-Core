import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Arrow } from '../components/Arrow';

describe('Arrow', () => {
  it('renders a right arrow by default', () => {
    const { container } = render(<Arrow />);
    expect(container.querySelector('.ax-arrow')).toBeInTheDocument();
  });

  it('uses aria-label when provided', () => {
    render(<Arrow aria-label="More details" />);
    expect(screen.getByLabelText('More details')).toBeInTheDocument();
  });

  it('is hidden from a11y tree when no label is given', () => {
    const { container } = render(<Arrow />);
    const arrow = container.querySelector('.ax-arrow');
    expect(arrow).toHaveAttribute('aria-hidden', 'true');
  });

  it('rotates for non-right directions', () => {
    const { container } = render(<Arrow direction="up" />);
    const arrow = container.querySelector('.ax-arrow') as HTMLElement;
    expect(arrow.style.transform).toBe('rotate(-90deg)');
  });
});
