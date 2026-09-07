import { type ReactNode } from 'react';

export interface LegendItem {
  /** Label text. */
  label: string;
  /** Color or symbol for the swatch. Pass a CSS color string or `currentColor`. */
  swatch: string;
  /** Optional override for the swatch shape. Default: square. */
  shape?: 'square' | 'disc' | 'line';
}

export interface LegendProps {
  items: LegendItem[];
  /** Title for the legend group. */
  title?: string;
}

/**
 * Legend — the color/symbol key for a chart, map, or wayfinding system.
 *
 * Place near the chart it explains. If a user has to hunt for the
 * legend, the chart has failed. Items render in a single row at
 * the natural reading direction; wrap is OK.
 *
 * @example
 *   <Legend
 *     title="Trunk lines"
 *     items={[
 *       { label: 'Blue', swatch: 'var(--rt-blue)' },
 *       { label: 'Orange', swatch: 'var(--rt-orange)' },
 *       { label: 'Green', swatch: 'var(--rt-green)' },
 *     ]}
 *   />
 */
export function Legend({ items, title }: LegendProps) {
  return (
    <div className="ax-legend" role="list" aria-label={title}>
      {items.map((it) => (
        <span key={it.label} className="ax-legend__item" role="listitem" style={{ color: it.swatch }}>
          <span
            className="ax-legend__sw"
            style={{
              borderRadius: it.shape === 'disc' ? '50%' : it.shape === 'line' ? '0' : '0',
              width: it.shape === 'line' ? 14 : 10,
              height: it.shape === 'line' ? 2 : 10,
            }}
            aria-hidden="true"
          />
          {it.label}
        </span>
      ))}
    </div>
  );
}
