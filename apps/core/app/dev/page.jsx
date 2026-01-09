import { Container, Card } from '@repo/ui';
import { getAppsWithRoutes, sharedPackages, configs } from '@repo/pathfinder';

export const metadata = {
  title: 'Dev Navigator | Micro-Frontends POC',
  description: 'Navigate between all apps and pages in the micro-frontends POC.',
};

export default function DevNavigatorPage() {
  const apps = getAppsWithRoutes('development');
  const routes = configs.development.routes;

  return (
    <Container className="py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Micro-Frontends POC Navigator</h1>
        <p className="text-lg text-neutral-600 max-w-3xl mb-4">
          Navigate all apps and pages in the micro-frontends proof of concept. Routes are loaded from{' '}
          <code className="bg-neutral-100 px-1 rounded text-sm">@repo/pathfinder</code>.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Gateway Mode:</strong> Run{' '}
            <code className="bg-blue-100 px-1 rounded">pnpm dev:gateway</code> to access all apps from{' '}
            <strong>http://localhost:3000</strong> with path-based routing (like production).
          </p>
        </div>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Apps & Pages</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => {
            const getFullPath = (pagePath) => {
              if (app.basePath && pagePath === '/') return app.basePath;
              return app.basePath + pagePath;
            };
            return (
              <Card key={app.key} variant="outline" className="overflow-hidden">
                <div className={`h-2 ${app.color}`} />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-neutral-900">{app.name}</h3>
                    {app.isCatchAll && (
                      <span className="px-2 py-0.5 text-xs font-mono bg-red-100 text-red-600 rounded">
                        Catch-all
                      </span>
                    )}
                    {app.basePath && (
                      <span className="px-2 py-0.5 text-xs font-mono bg-neutral-100 text-neutral-600 rounded">
                        {app.basePath}/*
                      </span>
                    )}
                    {app.port && (
                      <span className="px-2 py-0.5 text-xs font-mono bg-green-100 text-green-600 rounded">
                        :{app.port}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 mb-1 font-mono">{app.id}</p>
                  <p className="text-sm text-neutral-600 mb-4">{app.description}</p>
                  <div className="space-y-1">
                    {app.samplePages.map((page) => {
                      const fullPath = getFullPath(page.path);
                      return (
                        <a
                          key={page.path}
                          href={fullPath}
                          className="block text-sm text-primary-600 hover:text-primary-800 hover:underline"
                        >
                          {page.label}
                          <span className="text-neutral-400 ml-2 font-mono text-xs">{fullPath}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Pathfinder Routes</h2>
        <div className="bg-neutral-50 rounded-lg p-6">
          <p className="text-sm text-neutral-600 mb-4">
            Routes loaded from{' '}
            <code className="bg-neutral-200 px-1 rounded">
              packages/pathfinder/configs/development/www/routes.json
            </code>
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 px-3 font-medium text-neutral-700">Path</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-700">App</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-700">Type</th>
                </tr>
              </thead>
              <tbody>
                {routes
                  .filter((r) => !r.path.startsWith('/_mk-'))
                  .map((route, i) => (
                    <tr key={i} className="border-b border-neutral-100">
                      <td className="py-2 px-3 font-mono text-neutral-800">{route.path}</td>
                      <td className="py-2 px-3 text-neutral-600">{route.app}</td>
                      <td className="py-2 px-3">
                        {route.exact ? (
                          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                            exact
                          </span>
                        ) : route.path === '/*' ? (
                          <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">
                            catch-all
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs bg-neutral-100 text-neutral-600 rounded">
                            prefix
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Shared Packages</h2>
        <div className="bg-neutral-50 rounded-lg p-6">
          <p className="text-sm text-neutral-600 mb-4">
            These packages are shared across all apps. Look for the purple "Shared Component" badges in
            the Header and Footer to see them in action.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {sharedPackages.map((pkg) => (
              <div key={pkg.name} className="flex items-start gap-3">
                <span className="px-2 py-1 text-xs font-mono bg-purple-100 text-purple-700 rounded whitespace-nowrap">
                  {pkg.name}
                </span>
                <span className="text-sm text-neutral-600">{pkg.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Architecture Notes</h2>
        <div className="prose prose-neutral max-w-none">
          <div className="bg-neutral-50 rounded-lg p-6 space-y-4 text-sm">
            <div>
              <strong className="text-neutral-900">Gateway Mode (pnpm dev:gateway):</strong>
              <span className="text-neutral-600 ml-2">
                All apps accessible from localhost:3000 with path-based routing - mimics production.
              </span>
            </div>
            <div>
              <strong className="text-neutral-900">Production:</strong>
              <span className="text-neutral-600 ml-2">
                Single CloudFront distribution routes to App Runner services via Lambda@Edge
                (Pathfinder).
              </span>
            </div>
            <div>
              <strong className="text-neutral-900">Shared Components:</strong>
              <span className="text-neutral-600 ml-2">
                Header and Footer show purple badges indicating they come from @repo/ui.
              </span>
            </div>
            <div>
              <strong className="text-neutral-900">App Indicator:</strong>
              <span className="text-neutral-600 ml-2">
                Look for the app name badge next to the logo showing which micro-frontend you're
                viewing.
              </span>
            </div>
            <div>
              <strong className="text-neutral-900">Analytics Debug Panel:</strong>
              <span className="text-neutral-600 ml-2">
                Click the panel in the bottom-right corner to see loaded analytics providers.
              </span>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
