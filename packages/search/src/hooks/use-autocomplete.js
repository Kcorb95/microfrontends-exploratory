'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * @typedef {Object} UseAutocompleteState
 * @property {Array<{value: string, count?: number}>} suggestions - Autocomplete suggestions
 * @property {boolean} isLoading - Whether autocomplete is loading
 * @property {string} query - Current query
 * @property {number} selectedIndex - Currently selected suggestion index
 */

/**
 * @typedef {Object} UseAutocompleteActions
 * @property {(query: string) => void} getSuggestions - Get suggestions for query
 * @property {() => void} selectNext - Select next suggestion
 * @property {() => void} selectPrev - Select previous suggestion
 * @property {() => string|null} getSelected - Get selected suggestion value
 * @property {() => void} clear - Clear suggestions
 */

/**
 * Hook for autocomplete functionality
 * @param {import('../types.js').SearchClient} client - Search client instance
 * @param {Object} [options]
 * @param {number} [options.debounceMs] - Debounce delay in ms
 * @param {number} [options.minChars] - Minimum characters to trigger autocomplete
 * @returns {UseAutocompleteState & UseAutocompleteActions}
 */
export function useAutocomplete(client, options = {}) {
  const { debounceMs = 150, minChars = 2 } = options;

  const [state, setState] = useState({
    suggestions: [],
    isLoading: false,
    query: '',
    selectedIndex: -1,
  });

  const debounceRef = useRef(null);

  const getSuggestions = useCallback(
    async (query) => {
      // Clear previous debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (!query || query.length < minChars) {
        setState((prev) => ({
          ...prev,
          suggestions: [],
          query,
          selectedIndex: -1,
        }));
        return;
      }

      setState((prev) => ({ ...prev, query, isLoading: true }));

      debounceRef.current = setTimeout(async () => {
        try {
          const result = await client.autocomplete(query);
          setState((prev) => ({
            ...prev,
            suggestions: result.suggestions,
            isLoading: false,
            selectedIndex: -1,
          }));
        } catch {
          setState((prev) => ({
            ...prev,
            isLoading: false,
          }));
        }
      }, debounceMs);
    },
    [client, debounceMs, minChars]
  );

  const selectNext = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedIndex: Math.min(prev.selectedIndex + 1, prev.suggestions.length - 1),
    }));
  }, []);

  const selectPrev = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedIndex: Math.max(prev.selectedIndex - 1, -1),
    }));
  }, []);

  const getSelected = useCallback(() => {
    if (state.selectedIndex >= 0 && state.selectedIndex < state.suggestions.length) {
      return state.suggestions[state.selectedIndex].value;
    }
    return null;
  }, [state.selectedIndex, state.suggestions]);

  const clear = useCallback(() => {
    setState({
      suggestions: [],
      isLoading: false,
      query: '',
      selectedIndex: -1,
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
    getSuggestions,
    selectNext,
    selectPrev,
    getSelected,
    clear,
  };
}
