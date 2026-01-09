/**
 * Prismic Type Definitions (JSDoc)
 */

/**
 * @typedef {Object} PrismicConfig
 * @property {string} repository - Prismic repository name
 * @property {string} [accessToken] - API access token
 * @property {string} [defaultLocale] - Default locale (e.g., 'en-us')
 * @property {Object[]} [routes] - Route resolver configuration
 */

/**
 * @typedef {Object} PrismicSlice
 * @property {string} id - Slice ID
 * @property {string} slice_type - Slice type identifier
 * @property {string} [slice_label] - Optional slice label
 * @property {Object} primary - Primary fields
 * @property {Object[]} [items] - Repeatable items
 * @property {string} [variation] - Slice variation
 */

/**
 * @typedef {Object} PrismicLandingPage
 * @property {string} id - Document ID
 * @property {string} uid - Document UID (slug)
 * @property {string} type - Document type
 * @property {string} title - Page title
 * @property {PrismicSlice[]} slices - Page slices
 * @property {Object} [seo] - SEO metadata
 * @property {string} [seo.title] - SEO title
 * @property {string} [seo.description] - SEO description
 * @property {string} [seo.image] - OG image URL
 * @property {Date} first_publication_date - First publication date
 * @property {Date} last_publication_date - Last publication date
 */

/**
 * @typedef {Object} PrismicImage
 * @property {string} url - Image URL
 * @property {string} alt - Alt text
 * @property {Object} dimensions - Image dimensions
 * @property {number} dimensions.width - Width in pixels
 * @property {number} dimensions.height - Height in pixels
 */

/**
 * @typedef {Object} PrismicLink
 * @property {string} link_type - Link type ('Web', 'Document', 'Media')
 * @property {string} [url] - URL for web links
 * @property {string} [uid] - Document UID for document links
 * @property {string} [type] - Document type for document links
 */

/**
 * @typedef {Object} PrismicQueryOptions
 * @property {string} [locale] - Locale code
 * @property {string} [ref] - Prismic ref (for previews)
 * @property {number} [pageSize] - Results per page
 * @property {number} [page] - Page number
 * @property {string} [orderings] - Ordering (e.g., 'document.last_publication_date desc')
 */

/**
 * @typedef {Object} PrismicClient
 * @property {(uid: string, options?: PrismicQueryOptions) => Promise<PrismicLandingPage|null>} getLandingPage
 * @property {(options?: PrismicQueryOptions) => Promise<PrismicLandingPage[]>} getAllLandingPages
 * @property {(token: string) => void} enablePreview
 * @property {() => void} disablePreview
 * @property {() => boolean} isPreviewEnabled
 */

export {};
