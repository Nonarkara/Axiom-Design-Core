import { type CSSProperties } from 'react';

export interface ArrowProps {
  /** Direction. Default: right. */
  direction?: 'right' | 'left' | 'up' | 'down';
  /** Color override. Default --ink-2 (greyscale). Never a signal color. */
  color?: string;
  /** Accessible label. */
  'aria-label'?: string;
  /** Size in pixels. Default 7×10. */
  size?: number;
  /** Extra class. */
  className?: string;
}

/**
 * Arrow — a solid triangle that points. Never Unicode (`→ ➔`),
 * never a chevron, never a colored signal arrow.
 *
 * Direction arrows are GREYSCALE. The only way to make a
 * direction a signal is to make the surface it points to a
 * signal — e.g. a red-bordered panel, not a red arrow.
 *
 * @example
 *   <Arrow />                   // right, greyscale
 *   <Arrow direction="down" />  // down
 *   <Arrow aria-label="More" /> // for accessible links/buttons
 */
export function Arrow({ direction = 'right', color, 'aria-label': ariaLabel, size = 7, className }: ArrowProps) {
  const style: CSSProperties = {};
  if (color) style.borderLeftColor = color;
  // We render via a rotated span. The CSS class .ax-arrow defines the base
  // right-pointing triangle; for other directions we transform it.
  const transform =
    direction === 'left' ? 'scaleX(-1)' : direction === 'up' ? 'rotate(-90deg)' : direction === 'down' ? 'rotate(90deg)' : undefined;
  if (transform) style.transform = transform;
  if (size) {
    style.borderTopWidth = `${Math.round(size * 0.7)}px`;
    style.borderBottomWidth = `${Math.round(size * 0.7)}px`;
    style.borderLeftWidth = `${size}px`;
  }
  return (
    <span
      className={['ax-arrow', className].filter(Boolean).join(' ')}
      style={style}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
}
