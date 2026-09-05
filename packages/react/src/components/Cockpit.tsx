import { type ReactNode, type HTMLAttributes } from 'react';

export interface CockpitProps extends HTMLAttributes<HTMLDivElement> {
  /** TopBar (or any global header) goes here. */
  topbar?: ReactNode;
  /** Main content. Use Board / Panel inside. */
  children: ReactNode;
  /** Footer content (provenance, system status). */
  footer?: ReactNode;
  /** Override the root element. Default `div`. */
  as?: 'div' | 'main';
}

/**
 * Cockpit — the full-page control room shell. Three regions:
 * topbar (navigation + vital signs), main (boards), footer
 * (provenance + system status). Min-height 100vh.
 *
 * @example
 *   <Cockpit
 *     topbar={<TopBar brand={<Disc>A</Disc>} links={links} right={<Chip dot variant="signal">6 APIs down</Chip>} />}
 *     footer={<span>Axiom v2.0 · 47 live feeds · source 2026-09-06 14:00 ICT</span>}
 *   >
 *     <Hero label="AQI Bangkok" value={157} sub="↑ 12.3% vs 7d" />
 *     <Board>
 *       <Panel title="Live feeds">...</Panel>
 *       <Panel title="Top movers">...</Panel>
 *     </Board>
 *   </Cockpit>
 */
export function Cockpit({ topbar, children, footer, as: Tag = 'div', className, ...rest }: CockpitProps) {
  const cls = ['ax-cockpit', className].filter(Boolean).join(' ');
  return (
    <Tag className={cls} {...rest}>
      {topbar}
      <main className="ax-cockpit__main">{children}</main>
      {footer ? <footer className="ax-cockpit__foot">{footer}</footer> : null}
    </Tag>
  );
}
