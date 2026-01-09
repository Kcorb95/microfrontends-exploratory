import { HeroBanner } from './HeroBanner';
import { FeatureGrid } from './FeatureGrid';
import { Testimonial } from './Testimonial';
import { CTASection } from './CTASection';
import { StatsSection } from './StatsSection';

/**
 * Map of slice types to components
 */
const sliceComponents = {
  hero_banner: HeroBanner,
  hero_split: HeroBanner,
  feature_grid: FeatureGrid,
  feature_list: FeatureGrid,
  testimonial: Testimonial,
  cta_section: CTASection,
  stats_section: StatsSection,
  comparison_table: () => null, // TODO: Implement
  pricing_table: () => null, // TODO: Implement
};

/**
 * SliceZone component - renders Prismic slices
 * @param {Object} props
 * @param {Array} props.slices - Array of Prismic slices
 */
export function SliceZone({ slices }) {
  if (!slices || slices.length === 0) {
    return null;
  }

  return (
    <>
      {slices.map((slice) => {
        const SliceComponent = sliceComponents[slice.slice_type];

        if (!SliceComponent) {
          console.warn(`Unknown slice type: ${slice.slice_type}`);
          return null;
        }

        return (
          <SliceComponent
            key={slice.id}
            primary={slice.primary}
            items={slice.items}
          />
        );
      })}
    </>
  );
}
