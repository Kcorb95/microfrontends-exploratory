import { Container, Button } from '@repo/ui';

/**
 * CTA Section slice component
 * @param {Object} props
 * @param {Object} props.primary - Primary slice data
 */
export function CTASection({ primary }) {
  const {
    title,
    description,
    cta_text,
    cta_link,
    secondary_cta_text,
    secondary_cta_link,
  } = primary;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-secondary-600">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-white/90 mb-8">{description}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {cta_text && (
              <Button
                size="lg"
                variant="secondary"
                as="a"
                href={cta_link || '#'}
              >
                {cta_text}
              </Button>
            )}
            {secondary_cta_text && (
              <Button
                size="lg"
                variant="outline"
                as="a"
                href={secondary_cta_link || '#'}
                className="border-white text-white hover:bg-white/10"
              >
                {secondary_cta_text}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
