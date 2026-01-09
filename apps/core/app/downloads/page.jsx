import { Hero, Container, Card, CardHeader, CardTitle, CardDescription, CardFooter, Button, Grid } from '@repo/ui';

export const metadata = {
  title: 'Downloads',
  description: 'Download Platform for your operating system.',
};

const platforms = [
  {
    name: 'macOS',
    icon: '🍎',
    version: '11.0.0',
    size: '120 MB',
    requirements: 'macOS 12 or later',
    downloadUrl: '#',
    variants: [
      { label: 'Apple Silicon', arch: 'arm64' },
      { label: 'Intel', arch: 'x64' },
    ],
  },
  {
    name: 'Windows',
    icon: '🪟',
    version: '11.0.0',
    size: '115 MB',
    requirements: 'Windows 10 or later',
    downloadUrl: '#',
    variants: [
      { label: '64-bit', arch: 'x64' },
      { label: '32-bit', arch: 'x86' },
    ],
  },
  {
    name: 'Linux',
    icon: '🐧',
    version: '11.0.0',
    size: '110 MB',
    requirements: 'Ubuntu 20.04+ or equivalent',
    downloadUrl: '#',
    variants: [
      { label: '.deb', arch: 'deb' },
      { label: '.rpm', arch: 'rpm' },
      { label: '.tar.gz', arch: 'tar' },
    ],
  },
];

const mobileApps = [
  {
    name: 'iOS',
    icon: '📱',
    description: 'iPhone and iPad',
    storeUrl: '#',
    storeName: 'App Store',
  },
  {
    name: 'Android',
    icon: '🤖',
    description: 'Phone and tablet',
    storeUrl: '#',
    storeName: 'Google Play',
  },
];

export default function DownloadsPage() {
  return (
    <>
      <Hero
        size="md"
        align="center"
        eyebrow="Downloads"
        title="Download Platform for your device"
        description="Available on macOS, Windows, Linux, iOS, and Android."
      />

      <Container>
        <section className="py-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">Desktop Apps</h2>
          <Grid cols={3} gap="lg">
            {platforms.map((platform) => (
              <Card key={platform.name} variant="outline" padding="lg">
                <div className="text-5xl mb-4">{platform.icon}</div>
                <CardHeader>
                  <CardTitle>{platform.name}</CardTitle>
                  <CardDescription>
                    Version {platform.version} · {platform.size}
                  </CardDescription>
                </CardHeader>
                <p className="text-sm text-neutral-500 mt-2 mb-4">
                  {platform.requirements}
                </p>
                <CardFooter className="flex-col gap-2">
                  <Button className="w-full">
                    Download for {platform.name}
                  </Button>
                  <div className="flex gap-2 w-full">
                    {platform.variants.map((variant) => (
                      <Button
                        key={variant.arch}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        {variant.label}
                      </Button>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </section>

        <section className="py-12 border-t border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">Mobile Apps</h2>
          <Grid cols={2} gap="lg">
            {mobileApps.map((app) => (
              <Card key={app.name} variant="outline" padding="lg">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{app.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900">{app.name}</h3>
                    <p className="text-sm text-neutral-500">{app.description}</p>
                  </div>
                  <Button variant="outline">
                    {app.storeName}
                  </Button>
                </div>
              </Card>
            ))}
          </Grid>
        </section>

        <section className="py-12 border-t border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Release Notes</h2>
          <p className="text-neutral-600 mb-4">
            See what's new in the latest version of Platform.
          </p>
          <Button variant="outline" as="a" href="/release-notes">
            View Release Notes
          </Button>
        </section>
      </Container>
    </>
  );
}
