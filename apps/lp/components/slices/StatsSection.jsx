import { Container, Grid } from '@repo/ui';

/**
 * Stats Section slice component
 * @param {Object} props
 * @param {Object} props.primary - Primary slice data
 * @param {Array} props.items - Stat items
 */
export function StatsSection({ primary, items }) {
  const { title } = primary;

  return (
    <section className="py-16 md:py-24 bg-neutral-900 text-white">
      <Container>
        {title && (
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        )}
        <Grid cols={items?.length || 3} gap="lg">
          {items?.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">
                {item.value}
              </div>
              <div className="text-neutral-400">{item.label}</div>
            </div>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
