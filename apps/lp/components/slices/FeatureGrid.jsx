import { Container, Grid, Card, CardHeader, CardTitle, CardDescription } from '@repo/ui';

/**
 * FeatureGrid slice component
 * @param {Object} props
 * @param {Object} props.primary - Primary slice data
 * @param {Array} props.items - Feature items
 */
export function FeatureGrid({ primary, items }) {
  const { title, layout } = primary;

  // Determine grid columns based on layout
  const cols = layout === 'three_column' ? 3 : layout === 'two_column' ? 2 : 3;

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <Container>
        {title && (
          <h2 className="text-3xl font-bold text-neutral-900 text-center mb-12">
            {title}
          </h2>
        )}
        <Grid cols={cols} gap="lg">
          {items?.map((item, index) => (
            <Card key={index} variant="default" padding="lg">
              {item.icon && (
                <div className="text-3xl mb-4">{getIconEmoji(item.icon)}</div>
              )}
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </Grid>
      </Container>
    </section>
  );
}

/**
 * Map icon names to emojis (in production, use actual icons)
 */
function getIconEmoji(iconName) {
  const iconMap = {
    shield: '🛡️',
    server: '🖥️',
    users: '👥',
    test: '✅',
    docs: '📚',
    team: '👥',
    code: '💻',
    cloud: '☁️',
    lock: '🔒',
    speed: '⚡',
  };
  return iconMap[iconName] || '✨';
}
