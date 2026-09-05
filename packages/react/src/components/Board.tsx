import { type HTMLAttributes, type ReactNode } from 'react';

export interface BoardProps extends HTMLAttributes<HTMLDivElement> {
  /** Board contents — Panels, StatCells, charts. */
  children: ReactNode;
  /** Minimum column width. Default 280px. */
  minCol?: number;
}

/**
 * Board — the multi-region container. Auto-fit grid of Panels.
 * Snap to the same border weight as Panel and Cockpit for the
 * MoMA Law.
 *
 * @example
 *   <Board>
 *     <Panel title="Live feeds">...</Panel>
 *     <Panel title="Top movers">...</Panel>
 *     <Panel title="Sources">...</Panel>
 *   </Board>
 */
export function Board({ children, minCol = 280, className, style, ...rest }: BoardProps) {
  const finalStyle = {
    ...style,
    gridTemplateColumns: `repeat(auto-fit, minmax(${minCol}px, 1fr))`,
  };
  return (
    <div className={['ax-board', className].filter(Boolean).join(' ')} style={finalStyle} {...rest}>
      {children}
    </div>
  );
}
