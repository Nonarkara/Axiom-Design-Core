import { type ButtonHTMLAttributes, forwardRef } from 'react';

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Tab label. */
  children: string;
  /** Selected state. */
  selected?: boolean;
}

/**
 * Tab — a single tab in a tab group. Use inside a custom Tab.Group
 * (a flex row). Selected state draws a 2px bottom border in --ink.
 *
 * @example
 *   <div role="tablist">
 *     <Tab selected>Live</Tab>
 *     <Tab>7d</Tab>
 *     <Tab>30d</Tab>
 *   </div>
 */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { children, selected = false, className, ...rest },
  ref,
) {
  const cls = ['ax-tab', className].filter(Boolean).join(' ');
  return (
    <button ref={ref} role="tab" aria-selected={selected} className={cls} {...rest}>
      {children}
    </button>
  );
});
