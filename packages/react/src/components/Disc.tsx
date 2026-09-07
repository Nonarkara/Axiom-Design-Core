import { type HTMLAttributes, type ReactNode } from 'react';

export interface DiscProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Disc text — usually 1-3 characters. Rendered uppercase via CSS. */
  children: ReactNode;
  /** Size variant. Default 28px. */
  size?: 'sm' | 'md' | 'lg';
  /** Override the color. Use sparingly — the default --blue is the law. */
  tone?: 'identity' | 'ink';
}

/**
 * Disc — the enclosed identity mark. A square block of color that
 * says "this is board A" / "this is route Blue" / "this is Non".
 *
 * The disc is the address. In Axiom, the default tone is the
 * identity blue (--blue). Use `tone="ink"` for greyscale variants
 * when color would compete with the main identity.
 *
 * @example
 *   <Disc>A</Disc>          // board A
 *   <Disc size="lg">NYCTA</Disc>  // for hero/header
 *   <Disc tone="ink">i</Disc>    // info, not a board
 */
export function Disc({ children, size = 'md', tone = 'identity', className, style, ...rest }: DiscProps) {
  const cls = [
    'ax-disc',
    size === 'lg' && 'ax-disc--lg',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const finalStyle =
    tone === 'ink'
      ? { background: 'var(--ink)', color: 'var(--paper)', ...style }
      : style;
  return (
    <span className={cls} style={finalStyle} {...rest}>
      {children}
    </span>
  );
}
