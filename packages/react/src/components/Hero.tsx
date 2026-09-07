import { type HTMLAttributes, type ReactNode } from 'react';

export interface HeroProps extends HTMLAttributes<HTMLDivElement> {
  /** Section / page label above the hero value. */
  label: string;
  /** The one big number / phrase. Use sparingly — this is the Divine Move. */
  value: ReactNode;
  /** Sub-line under the value (unit, comparison, period). */
  sub?: ReactNode;
  /** Right-aligned meta (timestamp, source). */
  meta?: ReactNode;
}

/**
 * Hero — the one Divine Move per surface. One big number, one label,
 * one sub-line. If a page has more than one Hero, the page is
 * broken. Demote the second one to a StatCell.
 *
 * @example
 *   <Hero label="AQI — Bangkok" value={157} sub="↑ 12.3% vs 7d" meta="2026-09-06 14:00 ICT" />
 */
export function Hero({ label, value, sub, meta, className, ...rest }: HeroProps) {
  return (
    <section className={['ax-hero', className].filter(Boolean).join(' ')} {...rest}>
      <div className="ax-hero__lbl">{label}</div>
      <div className="ax-hero__val">{value}</div>
      {sub ? <div className="ax-hero__sub">{sub}</div> : null}
      {meta ? <div className="ax-mute" style={{ fontSize: 'var(--t-micro)' }}>{meta}</div> : null}
    </section>
  );
}
