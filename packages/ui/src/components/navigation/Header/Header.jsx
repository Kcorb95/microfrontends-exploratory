'use client';

import { useState } from 'react';
import { cn } from '@repo/utils';
import { Container } from '../../layout/Container/Container.jsx';
import { Nav, NavLink } from '../Nav/Nav.jsx';
import { Button } from '../../base/Button/Button.jsx';
import { SharedBadge } from '../../debug/index.js';

/**
 * @typedef {Object} HeaderNavItem
 * @property {string} label
 * @property {string} href
 * @property {boolean} [active]
 */

/**
 * Header component with responsive navigation
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.logo]
 * @param {HeaderNavItem[]} [props.navItems]
 * @param {React.ReactNode} [props.actions]
 * @param {React.ReactNode} [props.search] - Search component slot
 * @param {React.ReactNode} [props.appIndicator] - App indicator slot
 * @param {boolean} [props.sticky]
 * @param {boolean} [props.showDebugBadge] - Show shared component badge
 */
export function Header({
  className,
  logo,
  navItems = [],
  actions,
  search,
  appIndicator,
  sticky = true,
  showDebugBadge = true,
  ...props
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        'z-50 w-full border-b border-neutral-200 bg-white relative',
        sticky && 'sticky top-0',
        className
      )}
      {...props}
    >
      {showDebugBadge && (
        <SharedBadge package="@repo/ui" component="Header" position="top-left" />
      )}
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo + App Indicator */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {logo}
            {appIndicator}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6 flex-1 min-w-0">
            <Nav items={navItems} />
          </div>

          {/* Search + Actions */}
          <div className="hidden md:flex md:items-center md:gap-4 flex-shrink-0">
            {search && <div className="w-48 lg:w-64">{search}</div>}
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-neutral-200 py-4 md:hidden">
            {search && <div className="mb-4">{search}</div>}
            <Nav orientation="vertical" items={navItems} className="mb-4" />
            {actions && <div className="flex flex-col gap-2">{actions}</div>}
          </div>
        )}
      </Container>
    </header>
  );
}
