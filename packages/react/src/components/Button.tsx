import { type ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant. Default neutral.
   * - primary: filled ink, paper text (one per surface, the main action).
   * - signal: red border, red text (one per surface, the destructive / live action).
   */
  variant?: 'neutral' | 'primary' | 'signal';
  /** Optional arrow indicator after the label. */
  arrow?: boolean;
}

/**
 * Button — flat, hairline-bordered, no shadow. Two variants for
 * emphasis (primary, signal); everything else is neutral.
 *
 * If a page has more than one primary button, demote the second to
 * neutral. The shadow / 3D effect is banned.
 *
 * @example
 *   <Button>Cancel</Button>
 *   <Button variant="primary">Deploy</Button>
 *   <Button variant="signal">Disconnect feed</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'neutral', arrow = false, className, children, ...rest },
  ref,
) {
  const cls = [
    'ax-btn',
    variant === 'primary' && 'ax-btn--primary',
    variant === 'signal' && 'ax-btn--signal',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button ref={ref} className={cls} {...rest}>
      {children}
      {arrow ? <span className="ax-arrow" aria-hidden="true" style={{ marginLeft: 4 }} /> : null}
    </button>
  );
});
