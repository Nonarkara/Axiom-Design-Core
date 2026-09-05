import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Panel } from '../components/Panel';

describe('Panel', () => {
  it('renders title, meta, and children', () => {
    render(
      <Panel title="Live feeds" meta="47 active">
        <span>child</span>
      </Panel>,
    );
    expect(screen.getByText('Live feeds')).toBeInTheDocument();
    expect(screen.getByText('47 active')).toBeInTheDocument();
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('omits header when neither title nor meta is set', () => {
    render(
      <Panel>
        <span>body</span>
      </Panel>,
    );
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
  });

  it('applies flush class when flush is true', () => {
    const { container } = render(
      <Panel title="x" flush>
        body
      </Panel>,
    );
    expect(container.querySelector('.ax-panel__body--flush')).toBeInTheDocument();
  });
});
