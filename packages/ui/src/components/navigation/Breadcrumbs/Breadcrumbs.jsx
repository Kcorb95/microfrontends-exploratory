import { cn } from '@repo/utils';

/**
 * @typedef {Object} BreadcrumbItem
 * @property {string} label
 * @property {string} [href]
 */

/**
 * Breadcrumbs component for navigation hierarchy
 * @param {Object} props
 * @param {string} [props.className]
 * @param {BreadcrumbItem[]} props.items
 * @param {string} [props.separator]
 */
export function Breadcrumbs({
  className,
  items,
  separator = '/',
  ...props
}) {
  return (
    <nav aria-label="Breadcrumb" className={className} {...props}>
      <ol className="flex items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="text-neutral-500 transition-colors hover:text-neutral-700"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={cn(
                    isLast ? 'font-medium text-neutral-900' : 'text-neutral-500'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="text-neutral-400" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
