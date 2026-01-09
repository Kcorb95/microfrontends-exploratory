/**
 * Contentful Type Definitions (JSDoc)
 */

/**
 * @typedef {Object} ContentfulConfig
 * @property {string} spaceId - Contentful space ID
 * @property {string} accessToken - Content Delivery API access token
 * @property {string} [previewToken] - Content Preview API access token
 * @property {string} [environment] - Environment name (default: 'master')
 * @property {string} [host] - API host (default: 'cdn.contentful.com')
 */

/**
 * @typedef {Object} ContentfulEntry
 * @property {string} id - Entry ID (sys.id)
 * @property {string} contentType - Content type ID
 * @property {Object} fields - Entry fields
 * @property {ContentfulSys} sys - System metadata
 */

/**
 * @typedef {Object} ContentfulSys
 * @property {string} id - Entry ID
 * @property {string} type - System type
 * @property {string} contentType - Content type reference
 * @property {string} locale - Entry locale
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 * @property {number} revision - Revision number
 */

/**
 * @typedef {Object} ContentfulPage
 * @property {string} id - Page ID
 * @property {string} slug - URL slug
 * @property {string} title - Page title
 * @property {string} [description] - Meta description
 * @property {ContentfulSeo} [seo] - SEO metadata
 * @property {ContentfulSection[]} [sections] - Page sections
 * @property {Date} publishedAt - Publish date
 */

/**
 * @typedef {Object} ContentfulSeo
 * @property {string} [title] - SEO title
 * @property {string} [description] - SEO description
 * @property {ContentfulAsset} [image] - OG image
 * @property {boolean} [noIndex] - Prevent indexing
 */

/**
 * @typedef {Object} ContentfulSection
 * @property {string} id - Section ID
 * @property {string} type - Section content type
 * @property {Object} fields - Section fields
 */

/**
 * @typedef {Object} ContentfulAsset
 * @property {string} id - Asset ID
 * @property {string} title - Asset title
 * @property {string} [description] - Asset description
 * @property {ContentfulFile} file - File details
 */

/**
 * @typedef {Object} ContentfulFile
 * @property {string} url - File URL
 * @property {string} fileName - Original filename
 * @property {string} contentType - MIME type
 * @property {Object} [details] - File details
 * @property {Object} [details.image] - Image details
 * @property {number} [details.image.width] - Width in pixels
 * @property {number} [details.image.height] - Height in pixels
 * @property {number} [details.size] - File size in bytes
 */

/**
 * @typedef {Object} ContentfulTemplate
 * @property {string} id - Template ID
 * @property {string} slug - URL slug
 * @property {string} name - Template name
 * @property {string} [description] - Template description
 * @property {string} [category] - Template category
 * @property {ContentfulAsset} [thumbnail] - Thumbnail image
 * @property {Object} [metadata] - Additional metadata
 */

/**
 * @typedef {Object} ContentfulDoc
 * @property {string} id - Document ID
 * @property {string[]} path - Document path segments
 * @property {string} title - Document title
 * @property {Object} content - Rich text content (Document)
 * @property {string} [description] - Document description
 * @property {number} [order] - Sort order
 * @property {ContentfulDoc[]} [children] - Child documents
 */

/**
 * @typedef {Object} ContentfulQueryOptions
 * @property {number} [limit] - Maximum results (default: 100)
 * @property {number} [skip] - Results to skip
 * @property {string} [locale] - Locale code
 * @property {string} [order] - Ordering (e.g., '-sys.createdAt')
 * @property {number} [include] - Include depth for linked entries (0-10)
 * @property {Object} [query] - Additional query parameters
 */

/**
 * @typedef {Object} ContentfulClient
 * @property {(id: string, options?: ContentfulQueryOptions) => Promise<ContentfulEntry|null>} getEntry
 * @property {(contentType: string, options?: ContentfulQueryOptions) => Promise<ContentfulEntry[]>} getEntries
 * @property {(slug: string, options?: ContentfulQueryOptions) => Promise<ContentfulPage|null>} getPage
 * @property {(slug: string, options?: ContentfulQueryOptions) => Promise<ContentfulTemplate|null>} getTemplate
 * @property {(options?: ContentfulQueryOptions) => Promise<ContentfulTemplate[]>} getTemplates
 * @property {(path: string[], options?: ContentfulQueryOptions) => Promise<ContentfulDoc|null>} getDoc
 * @property {(options?: ContentfulQueryOptions) => Promise<ContentfulDoc[]>} getDocNavigation
 * @property {(token: string) => void} enablePreview
 * @property {() => void} disablePreview
 * @property {() => boolean} isPreviewEnabled
 */

export {};
