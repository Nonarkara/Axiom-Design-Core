import { type HTMLAttributes, type ReactNode } from 'react';

export interface StatCellProps extends HTMLAttributes<HTMLDivElement> {
  /** Label / KPI name. Auto-uppercased via CSS. */
  label: string;
  /** The value. Plain number or string. */
  value: ReactNode;
  /** Optional sub-line (unit, period, comparison). */
  sub?: ReactNode;
  /**
   * Visual variant. Default: neutral stat.
   * - identity: enclosed left blue rule (use for the one board/section this cell identifies).
   * - signal: red value (use only when the value is live/critical/down — one spike per surface).
   */
  variant?: 'neutral' | 'identity' | 'signal';
}

/**
 * StatCell — the Axiom metric tile.
 *
 * One bold value, one label, one sub-line. The workhorse of any
 * dashboard. Square corners, hairline border, tabular numerals.
 *
 * @example
 *   <StatCell label="AQI — Bangkok" value={157} sub="↑ 12.3% vs 7d" variant="signal" />
 */
export function StatCell({ label, value, sub, variant = 'neutral', className, ...rest }: StatCellProps) {
  const cls = [
    'ax-stat',
    variant === 'identity' && 'ax-stat--identity',
    variant === 'signal' && 'ax-stat--signal',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} {...rest}>
      <div className="ax-stat__lbl">{label}</div>
      <div className="ax-stat__val">{value}</div>
      {sub ? <div className="ax-stat__sub">{sub}</div> : null}
    </div>
  );
}
