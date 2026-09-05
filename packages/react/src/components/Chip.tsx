import { type HTMLAttributes, type ReactNode } from 'react';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Chip text. */
  children: ReactNode;
  /**
   * Visual variant. Default: neutral (hairline border, ink-2 text).
   * - signal: red border + red text — for the one live/critical state.
   * - identity: filled blue, paper text — enclosed, for the one identity the chip marks.
   */
  variant?: 'neutral' | 'signal' | 'identity';
  /** When true, render a small filled dot before the label. */
  dot?: boolean;
}

/**
 * Chip — a small status pill. Use for tags, status flags, taxonomy marks.
 *
 * Chips should be sparse. If you have more than ~3 visible on a surface,
 * you have a decoration problem. The dot is the "pulse" — use it for
 * live status, not decoration.
 *
 * @example
 *   <Chip dot variant="signal">API DOWN</Chip>
 *   <Chip variant="identity">SLIC</Chip>
 */
export function Chip({ children, variant = 'neutral', dot = false, className, ...rest }: ChipProps) {
  const cls = [
    'ax-chip',
    variant === 'signal' && 'ax-chip--signal',
    variant === 'identity' && 'ax-chip--identity',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={cls} {...rest}>
      {dot ? <span className="ax-chip__dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
