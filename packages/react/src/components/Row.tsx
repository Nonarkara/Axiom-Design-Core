import { type HTMLAttributes, type ReactNode } from 'react';

export interface RowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Key (left column). */
  k: ReactNode;
  /** Value (middle column). */
  v: ReactNode;
  /** Delta (right column). Use `tone="neg"` to flag a negative move in --red. */
  d?: ReactNode;
  /** When true, render the delta in --red (signal color). */
  tone?: 'neutral' | 'neg';
}

/**
 * Row — a key / value / delta line. The dense data-row primitive.
 *
 * Use inside a Panel body for ranked lists, status tables, or any
 * data the user is reading rather than scanning. Sibling to Table
 * for when you need full control over layout.
 *
 * @example
 *   <Row k="AQI — Bangkok" v={157} d="+12.3%" tone="neg" />
 */
export function Row({ k, v, d, tone = 'neutral', className, ...rest }: RowProps) {
  const cls = ['ax-row', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <span className="ax-row__k">{k}</span>
      <span className="ax-row__v">{v}</span>
      {d != null ? (
        <span className={['ax-row__d', tone === 'neg' && 'ax-row__d--neg'].filter(Boolean).join(' ')}>{d}</span>
      ) : null}
    </div>
  );
}
