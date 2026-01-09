import './globals.css';
import { Header, Footer, AppIndicator, DevNav, navItems, footerSections, siteConfig } from '@repo/ui';
import { AnalyticsProvider, AnalyticsDebugPanel, createMockConfig } from '@repo/analytics';
import { SearchBox } from '@repo/search';

export const metadata = {
  title: {
    default: 'Acme',
    template: '%s | Acme',
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }) {
  const analyticsConfig = createMockConfig({ debug: process.env.NODE_ENV === 'development' });
  const isDev = process.env.NODE_ENV === 'development';

  // Add dev nav item in development
  const allNavItems = isDev
    ? [...navItems, { label: 'Dev Nav', href: '/dev' }]
    : navItems;

  return (
    <html lang="en">
      <body>
        <AnalyticsProvider config={analyticsConfig}>
          <Header
            logo={<span className="text-xl font-bold text-primary-600">{siteConfig.name}</span>}
            navItems={allNavItems}
            appIndicator={
              <AppIndicator
                appName="Core"
                appId="@apps/core"
                environment={process.env.NODE_ENV}
                variant="minimal"
              />
            }
            search={<SearchBox placeholder="Search..." />}
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
          <main className="min-h-screen">{children}</main>
          <Footer
            logo={<span className="text-xl font-bold text-white">{siteConfig.name}</span>}
            description={siteConfig.description}
            sections={footerSections}
            copyright={siteConfig.copyright(new Date().getFullYear())}
          />
          <DevNav />
          <AnalyticsDebugPanel />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
