import { type InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label above the input. Required for a11y unless `aria-label` is set. */
  label?: string;
  /** Hint text shown under the input. */
  hint?: string;
}

/**
 * Input — single-line text input. Hairline border, focus state
 * is a darker border, no glow.
 *
 * @example
 *   <Input label="Search" placeholder="Find a signal…" />
 *   <Input aria-label="Filter" placeholder="Filter" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, id, className, ...rest },
  ref,
) {
  const inputId = id ?? (label ? `ax-input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <label className="ax-stack ax-tight" style={{ display: 'inline-flex' }}>
      {label ? <span className="ax-stat__lbl">{label}</span> : null}
      <input ref={ref} id={inputId} className={['ax-input', className].filter(Boolean).join(' ')} {...rest} />
      {hint ? <span style={{ fontSize: 'var(--t-micro)', color: 'var(--ink-3)' }}>{hint}</span> : null}
    </label>
  );
});
