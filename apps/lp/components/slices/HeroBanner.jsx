import { Hero, Button } from '@repo/ui';

/**
 * HeroBanner slice component
 * @param {Object} props
 * @param {Object} props.primary - Primary slice data
 */
export function HeroBanner({ primary }) {
  const {
    title,
    subtitle,
    description,
    cta_text,
    cta_link,
    secondary_cta_text,
    secondary_cta_link,
    background_color,
    background_image,
  } = primary;

  // Determine background type
  let background = 'gradient';
  if (background_color) {
    background = 'primary';
  }

  return (
    <Hero
      size="lg"
      align="center"
      background={background}
      eyebrow={subtitle}
      title={title}
      description={description}
      actions={
        <>
          {cta_text && (
            <Button size="lg" as="a" href={cta_link || '#'}>
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
        </>
      }
    />
  );
}
