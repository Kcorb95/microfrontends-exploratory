import Link from 'next/link';
import { useRouter } from 'next/router';
import { Header, Footer, Container, AppIndicator, DevNav, navItems, footerSections, siteConfig } from '@repo/ui';
import { cn } from '@repo/utils';
import { SearchBox } from '@repo/search';
import { AnalyticsDebugPanel } from '@repo/analytics';

const sidebarNav = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Introduction', href: '/' },
      { label: 'Quick Start', href: '/getting-started' },
      { label: 'Installation', href: '/getting-started/installation' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { label: 'Authentication', href: '/authentication' },
      { label: 'Configuration', href: '/configuration' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { label: 'Overview', href: '/api-reference' },
      { label: 'Making Calls', href: '/api-reference/making-calls' },
      { label: 'Error Handling', href: '/api-reference/errors' },
    ],
  },
];

export default function Layout({ children }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        logo={
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary-600">{siteConfig.name}</span>
            <span className="text-sm text-neutral-500">Docs</span>
          </Link>
        }
        navItems={navItems}
        appIndicator={
          <AppIndicator
            appName="Docs"
            appId="@apps/docs"
            environment={process.env.NODE_ENV}
            variant="minimal"
          />
        }
        search={<SearchBox placeholder="Search docs..." />}
        actions={
          <>
            <a href="/login" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
              Sign in
            </a>
            <a
              href="/signup"
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Get Started
            </a>
          </>
        }
      />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 border-r border-neutral-200 bg-neutral-50">
          <nav className="sticky top-16 p-6 space-y-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {sidebarNav.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-neutral-900 mb-3">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'block text-sm py-1 px-2 rounded transition-colors',
                          router.asPath === item.href
                            ? 'bg-primary-100 text-primary-700 font-medium'
                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1">{children}</main>
      </div>

      <Footer
        logo={<span className="text-xl font-bold text-white">{siteConfig.name}</span>}
        description={siteConfig.description}
        sections={footerSections}
        copyright={siteConfig.copyright(new Date().getFullYear())}
      />
      <DevNav />
      <AnalyticsDebugPanel />
    </div>
  );
}
