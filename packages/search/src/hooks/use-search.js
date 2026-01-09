'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * @typedef {Object} UseSearchState
 * @property {import('../types.js').SearchHit[]} hits - Search results
 * @property {number} totalHits - Total number of results
 * @property {boolean} isLoading - Whether search is in progress
 * @property {Error|null} error - Any error that occurred
 * @property {string} query - Current search query
 * @property {number} page - Current page
 * @property {number} totalPages - Total number of pages
 */

/**
 * @typedef {Object} UseSearchActions
 * @property {(query: string) => void} search - Execute search
 * @property {() => void} nextPage - Go to next page
 * @property {() => void} prevPage - Go to previous page
 * @property {(page: number) => void} goToPage - Go to specific page
 * @property {() => void} reset - Reset search state
 */

/**
 * Hook for search functionality
 * @param {import('../types.js').SearchClient} client - Search client instance
 * @param {Object} [options]
 * @param {number} [options.hitsPerPage] - Results per page
 * @param {Object} [options.filters] - Default filters
 * @param {number} [options.debounceMs] - Debounce delay in ms
 * @returns {UseSearchState & UseSearchActions}
 */
export function useSearch(client, options = {}) {
  const { hitsPerPage = 20, filters, debounceMs = 300 } = options;

  const [state, setState] = useState({
    hits: [],
    totalHits: 0,
    isLoading: false,
    error: null,
    query: '',
    page: 0,
    totalPages: 0,
  });

  const debounceRef = useRef(null);

  const executeSearch = useCallback(
    async (query, page = 0) => {
      if (!client) return;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await client.search(query, {
          hitsPerPage,
          page,
          filters,
        });

        setState({
          hits: result.hits,
          totalHits: result.nbHits,
          isLoading: false,
          error: null,
          query,
          page: result.page,
          totalPages: result.nbPages,
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error,
        }));
      }
    },
    [client, hitsPerPage, filters]
  );

  const search = useCallback(
    (query) => {
      // Clear previous debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Debounce search
      debounceRef.current = setTimeout(() => {
        executeSearch(query, 0);
      }, debounceMs);
    },
    [executeSearch, debounceMs]
  );

  const nextPage = useCallback(() => {
    if (state.page < state.totalPages - 1) {
      executeSearch(state.query, state.page + 1);
    }
  }, [executeSearch, state.query, state.page, state.totalPages]);

  const prevPage = useCallback(() => {
    if (state.page > 0) {
      executeSearch(state.query, state.page - 1);
    }
  }, [executeSearch, state.query, state.page]);

  const goToPage = useCallback(
    (page) => {
      if (page >= 0 && page < state.totalPages) {
        executeSearch(state.query, page);
      }
    },
    [executeSearch, state.query, state.totalPages]
  );

  const reset = useCallback(() => {
    setState({
      hits: [],
      totalHits: 0,
      isLoading: false,
      error: null,
      query: '',
      page: 0,
      totalPages: 0,
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    ...state,
    search,
    nextPage,
    prevPage,
    goToPage,
    reset,
  };
}
