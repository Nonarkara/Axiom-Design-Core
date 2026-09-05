import { type HTMLAttributes, type ReactNode } from 'react';

export interface TopBarLink {
  href: string;
  label: string;
  /** Mark this as the currently active page. */
  current?: boolean;
}

export interface TopBarProps extends HTMLAttributes<HTMLElement> {
  /** Brand mark — short word or logotype. Rendered uppercase. */
  brand: ReactNode;
  /** Top-level navigation. Use sparingly (3-7 items). */
  links?: TopBarLink[];
  /** Right-side actions (login, profile, status). */
  right?: ReactNode;
}

/**
 * TopBar — the global header. Brand left, navigation middle, actions right.
 *
 * Keep links to 3-7 items. The hairline border (not a shadow) is the
 * only separator. If a TopBar has more than one level of navigation,
 * the second level belongs in a subnav or a Toolbar.
 *
 * @example
 *   <TopBar
 *     brand={<><Disc>A</Disc> Axiom</>}
 *     links={[
 *       { href: '/', label: 'Cockpit', current: true },
 *       { href: '/signals', label: 'Signals' },
 *       { href: '/sources', label: 'Sources' },
 *     ]}
 *     right={<Chip dot variant="signal">6 APIs down</Chip>}
 *   />
 */
export function TopBar({ brand, links = [], right, className, ...rest }: TopBarProps) {
  return (
    <header className={['ax-topbar', className].filter(Boolean).join(' ')} {...rest}>
      <div className="ax-topbar__brand">{brand}</div>
      {links.length > 0 ? (
        <nav className="ax-topbar__nav" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} className="ax-topbar__link" href={l.href} aria-current={l.current ? 'page' : undefined}>
              {l.label}
            </a>
          ))}
        </nav>
      ) : null}
      {right ? <div className="ax-grow" /> : null}
      {right}
    </header>
  );
}
