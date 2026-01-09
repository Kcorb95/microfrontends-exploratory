import { cn } from '@repo/utils';
import { Container } from '../../layout/Container/Container.jsx';
import { SharedBadge } from '../../debug/index.js';

/**
 * @typedef {Object} FooterLink
 * @property {string} label
 * @property {string} href
 */

/**
 * @typedef {Object} FooterSection
 * @property {string} title
 * @property {FooterLink[]} links
 */

/**
 * Footer component with multi-column layout
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.logo]
 * @param {string} [props.description]
 * @param {FooterSection[]} [props.sections]
 * @param {React.ReactNode} [props.social]
 * @param {string} [props.copyright]
 * @param {React.ReactNode} [props.bottom]
 * @param {boolean} [props.showDebugBadge] - Show shared component badge
 */
export function Footer({
  className,
  logo,
  description,
  sections = [],
  social,
  copyright,
  bottom,
  showDebugBadge = true,
  ...props
}) {
  return (
    <footer
      className={cn('bg-neutral-900 text-neutral-300 relative', className)}
      {...props}
    >
      {showDebugBadge && (
        <SharedBadge package="@repo/ui" component="Footer" position="top-right" />
      )}
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              {logo && <div className="mb-4">{logo}</div>}
              {description && (
                <p className="mb-6 text-sm text-neutral-400">{description}</p>
              )}
              {social && <div className="flex gap-4">{social}</div>}
            </div>

            {/* Link Columns */}
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-8 lg:grid-cols-4">
              {sections.map((section) => (
                <div key={section.title}>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="text-sm text-neutral-400 transition-colors hover:text-white"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {copyright && (
              <p className="text-sm text-neutral-500">{copyright}</p>
            )}
            {bottom && <div className="flex gap-6">{bottom}</div>}
          </div>
        </div>
      </Container>
    </footer>
  );
}
