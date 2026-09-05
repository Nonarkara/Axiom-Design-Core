import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCell } from '../components/StatCell';

describe('StatCell', () => {
  it('renders label, value, and sub', () => {
    render(<StatCell label="AQI" value={157} sub="↑ 12.3% vs 7d" />);
    expect(screen.getByText('AQI')).toBeInTheDocument();
    expect(screen.getByText('157')).toBeInTheDocument();
    expect(screen.getByText('↑ 12.3% vs 7d')).toBeInTheDocument();
  });

  it('applies identity variant class', () => {
    render(<StatCell label="Board A" value={42} variant="identity" />);
    const cell = screen.getByText('Board A').closest('.ax-stat');
    expect(cell).toHaveClass('ax-stat--identity');
  });

  it('applies signal variant class', () => {
    render(<StatCell label="API down" value={3} variant="signal" />);
    const cell = screen.getByText('API down').closest('.ax-stat');
    expect(cell).toHaveClass('ax-stat--signal');
  });

  it('omits sub when not provided', () => {
    render(<StatCell label="Live feeds" value={47} />);
    expect(screen.queryByText(/↑/)).not.toBeInTheDocument();
  });
});
