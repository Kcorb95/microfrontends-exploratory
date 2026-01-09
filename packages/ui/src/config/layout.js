/**
 * Shared layout configuration for all micro-frontend apps
 * This ensures consistent navigation and footer across the entire site
 */

export const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/platform' },
  { label: 'Templates', href: '/templates' },
  { label: 'Docs', href: '/docs' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Release Notes', href: '/release-notes' },
];

export const footerSections = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/platform' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Downloads', href: '/downloads' },
      { label: 'Release Notes', href: '/release-notes' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Templates', href: '/templates' },
      { label: 'API Reference', href: '/docs/api-reference' },
      { label: 'Getting Started', href: '/docs/getting-started' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/lp/blog' },
    ],
  },
];

export const siteConfig = {
  name: 'Acme',
  description: 'The modern platform for building APIs, testing, and documentation.',
  copyright: (year) => `© ${year} Acme, Inc. All rights reserved.`,
};
