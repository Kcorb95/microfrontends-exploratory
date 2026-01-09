import { cn } from '@repo/utils';

/**
 * @typedef {Object} NavItem
 * @property {string} label
 * @property {string} href
 * @property {boolean} [active]
 * @property {NavItem[]} [children]
 */

/**
 * Navigation link component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {string} props.href
 * @param {boolean} [props.active]
 * @param {React.ReactNode} [props.children]
 */
export function NavLink({ className, href, active, children, ...props }) {
  return (
    <a
      href={href}
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary-600',
        active ? 'text-primary-600' : 'text-neutral-700',
        className
      )}
      aria-current={active ? 'page' : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

/**
 * Navigation component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {NavItem[]} [props.items]
 * @param {'horizontal' | 'vertical'} [props.orientation]
 * @param {React.ReactNode} [props.children]
 */
export function Nav({
  className,
  items,
  orientation = 'horizontal',
  children,
  ...props
}) {
  return (
    <nav
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row items-center gap-6' : 'flex-col gap-2',
        className
      )}
      {...props}
    >
      {items
        ? items.map((item) => (
            <NavLink key={item.href} href={item.href} active={item.active}>
              {item.label}
            </NavLink>
          ))
        : children}
    </nav>
  );
}
