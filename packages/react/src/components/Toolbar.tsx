import { type ReactNode, Children, isValidElement, cloneElement } from 'react';

export interface ToolbarProps {
  /** Toolbar contents — Buttons, Inputs, Chips, or a Toolbar.Sep. */
  children: ReactNode;
  /** Accessible label. */
  'aria-label'?: string;
}

/**
 * Toolbar — a local control row. Sits at the top of a panel, a board,
 * or a page section. Use for filters, view toggles, action buttons.
 *
 * <Toolbar.Sep/> renders a hairline vertical separator.
 *
 * @example
 *   <Toolbar aria-label="Filters">
 *     <Button>All</Button>
 *     <Button>Signals</Button>
 *     <Toolbar.Sep />
 *     <Input placeholder="Search" />
 *   </Toolbar>
 */
export function Toolbar({ children, 'aria-label': ariaLabel }: ToolbarProps) {
  return (
    <div className="ax-toolbar" role="toolbar" aria-label={ariaLabel}>
      {children}
    </div>
  );
}

function Sep() {
  return <span className="ax-toolbar__sep" role="separator" aria-orientation="vertical" />;
}

Toolbar.Sep = Sep;

/**
 * Inline children helper: any direct child Button / Input / Chip picks up
 * the toolbar's spacing automatically.
 */
export function ToolbarChild({ children }: { children: ReactNode }) {
  return <>{Children.map(children, (c) => (isValidElement(c) ? cloneElement(c) : c))}</>;
}
