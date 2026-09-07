import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Row } from '../components/Row';

describe('Row', () => {
  it('renders key, value, and delta', () => {
    render(<Row k="AQI" v={157} d="+12.3%" />);
    expect(screen.getByText('AQI')).toBeInTheDocument();
    expect(screen.getByText('157')).toBeInTheDocument();
    expect(screen.getByText('+12.3%')).toBeInTheDocument();
  });

  it('applies tone="neg" for negative signal', () => {
    render(<Row k="API" v={3} d="down" tone="neg" />);
    const delta = screen.getByText('down');
    expect(delta).toHaveClass('ax-row__d--neg');
  });

  it('omits delta when not provided', () => {
    render(<Row k="name" v="value" />);
    expect(screen.queryByText(/^%/)).not.toBeInTheDocument();
  });
});
