import { type HTMLAttributes, type ReactNode } from 'react';

export interface PanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Panel title — auto-uppercased. */
  title?: ReactNode;
  /** Right-aligned meta (timestamp, source, count). */
  meta?: ReactNode;
  /** Body content. */
  children: ReactNode;
  /** Render the body with zero padding. Useful for tables and full-bleed charts. */
  flush?: boolean;
  /** Override root element. Default `section`. */
  as?: 'section' | 'article' | 'aside' | 'div';
}

/**
 * Panel — the unit of composition. A bordered container with a
 * hairline header and a body. Use Panels to group related stats,
 * rows, or charts. Sibling components snap to the same border
 * weight — MoMA Law.
 *
 * @example
 *   <Panel title="Live Feeds" meta="47 active">
 *     <Row k="PM2.5 — Bangkok" v={42} d="-3" />
 *   </Panel>
 */
export function Panel({ title, meta, children, flush = false, as: Tag = 'section', className, ...rest }: PanelProps) {
  const cls = ['ax-panel', className].filter(Boolean).join(' ');
  return (
    <Tag className={cls} {...rest}>
      {title || meta ? (
        <header className="ax-panel__head">
          {title ? <div className="ax-panel__title">{title}</div> : <span />}
          {meta ? <div className="ax-panel__meta">{meta}</div> : null}
        </header>
      ) : null}
      <div className={flush ? 'ax-panel__body ax-panel__body--flush' : 'ax-panel__body'}>{children}</div>
    </Tag>
  );
}
