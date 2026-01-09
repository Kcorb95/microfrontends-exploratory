'use client';

import { cn } from '@repo/utils';

/**
 * SearchResults component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {import('../types.js').SearchHit[]} [props.hits]
 * @param {boolean} [props.isLoading]
 * @param {string} [props.query]
 * @param {number} [props.totalHits]
 * @param {(hit: import('../types.js').SearchHit) => void} [props.onHitClick]
 * @param {(hit: import('../types.js').SearchHit) => React.ReactNode} [props.renderHit]
 */
export function SearchResults({
  className,
  hits = [],
  isLoading = false,
  query,
  totalHits = 0,
  onHitClick,
  renderHit,
  ...props
}) {
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)} {...props}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 w-3/4 rounded bg-neutral-200" />
            <div className="mt-2 h-3 w-full rounded bg-neutral-100" />
            <div className="mt-1 h-3 w-2/3 rounded bg-neutral-100" />
          </div>
        ))}
      </div>
    );
  }

  if (query && hits.length === 0) {
    return (
      <div className={cn('py-8 text-center', className)} {...props}>
        <p className="text-neutral-500">No results found for "{query}"</p>
        <p className="mt-2 text-sm text-neutral-400">
          Try adjusting your search terms or filters
        </p>
      </div>
    );
  }

  if (hits.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4', className)} {...props}>
      {totalHits > 0 && (
        <p className="text-sm text-neutral-500">
          {totalHits} result{totalHits !== 1 ? 's' : ''} found
        </p>
      )}

      <div className="space-y-4">
        {hits.map((hit) =>
          renderHit ? (
            renderHit(hit)
          ) : (
            <SearchResultItem key={hit.objectID} hit={hit} onClick={() => onHitClick?.(hit)} />
          )
        )}
      </div>
    </div>
  );
}

/**
 * Default search result item
 * @param {Object} props
 * @param {import('../types.js').SearchHit} props.hit
 * @param {() => void} [props.onClick]
 */
function SearchResultItem({ hit, onClick }) {
  const title = hit._highlightResult?.title?.value || hit.title;
  const description = hit._highlightResult?.description?.value || hit.description;

  return (
    <a
      href={hit.url}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className="block rounded-lg border border-neutral-200 p-4 transition-colors hover:border-primary-300 hover:bg-primary-50/30"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3
            className="font-medium text-neutral-900"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          {description && (
            <p
              className="mt-1 text-sm text-neutral-600 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
          {hit.category && (
            <span className="mt-2 inline-block rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
              {hit.category}
            </span>
          )}
        </div>
        <svg
          className="h-5 w-5 flex-shrink-0 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </a>
  );
}

/**
 * Pagination component for search results
 * @param {Object} props
 * @param {string} [props.className]
 * @param {number} props.page
 * @param {number} props.totalPages
 * @param {() => void} props.onPrevPage
 * @param {() => void} props.onNextPage
 * @param {(page: number) => void} [props.onPageSelect]
 */
export function SearchPagination({
  className,
  page,
  totalPages,
  onPrevPage,
  onNextPage,
  onPageSelect,
  ...props
}) {
  if (totalPages <= 1) return null;

  return (
    <div className={cn('flex items-center justify-center gap-2', className)} {...props}>
      <button
        type="button"
        onClick={onPrevPage}
        disabled={page === 0}
        className={cn(
          'rounded-md px-3 py-1 text-sm font-medium transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'hover:bg-neutral-100'
        )}
      >
        Previous
      </button>

      <span className="px-3 text-sm text-neutral-500">
        Page {page + 1} of {totalPages}
      </span>

      <button
        type="button"
        onClick={onNextPage}
        disabled={page >= totalPages - 1}
        className={cn(
          'rounded-md px-3 py-1 text-sm font-medium transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'hover:bg-neutral-100'
        )}
      >
        Next
      </button>
    </div>
  );
}
