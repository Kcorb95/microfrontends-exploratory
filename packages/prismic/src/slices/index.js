/**
 * Prismic Slice Components
 *
 * This module exports slice components for rendering Prismic content.
 * In production, you would use @prismicio/react's <SliceZone> component.
 */

/**
 * Map slice type to component
 * @type {Record<string, React.ComponentType<{slice: import('../types.js').PrismicSlice}>>}
 */
export const sliceComponents = {
  // hero_banner: HeroBanner,
  // hero_split: HeroSplit,
  // feature_grid: FeatureGrid,
  // feature_list: FeatureList,
  // testimonial: Testimonial,
  // stats_section: StatsSection,
  // comparison_table: ComparisonTable,
  // cta_section: CtaSection,
  // faq_section: FaqSection,
  // pricing_table: PricingTable,
  // image_gallery: ImageGallery,
  // video_embed: VideoEmbed,
  // rich_text: RichText,
};

/**
 * Get the component for a slice type
 * @param {string} sliceType
 * @returns {React.ComponentType|null}
 */
export function getSliceComponent(sliceType) {
  return sliceComponents[sliceType] || null;
}

/**
 * Check if a slice type is supported
 * @param {string} sliceType
 * @returns {boolean}
 */
export function isSliceTypeSupported(sliceType) {
  return sliceType in sliceComponents;
}

/**
 * Get all supported slice types
 * @returns {string[]}
 */
export function getSupportedSliceTypes() {
  return Object.keys(sliceComponents);
}
