import { Hero, Container, Grid, Card, CardHeader, CardTitle, CardDescription, Button } from '@repo/ui';
import { createContentfulClient } from '@repo/contentful';

export default async function TemplatesHome() {
  const contentful = createContentfulClient({
    spaceId: process.env.CONTENTFUL_SPACE_ID || 'mock',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'mock',
  });
  const templates = await contentful.getTemplates();

  return (
    <>
      <Hero size="md" align="center" title="Templates" description="Start faster with pre-built templates for common use cases." />
      <Container>
        <section className="py-12">
          <Grid cols={3} gap="lg">
            {templates.map((template) => (
              <Card key={template.slug} variant="outline" padding="lg">
                <span className="text-xs font-medium text-primary-600 uppercase">{template.category}</span>
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-neutral-500">{template.metadata?.downloads?.toLocaleString()} downloads</span>
                  <Button size="sm">Use Template</Button>
                </div>
              </Card>
            ))}
          </Grid>
        </section>
      </Container>
    </>
  );
}
