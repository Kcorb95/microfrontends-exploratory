'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@repo/utils';
import { SharedBadge } from './SharedBadge.jsx';

/**
 * SearchBox component with autocomplete support
 * @param {Object} props
 * @param {string} [props.className]
 * @param {string} [props.placeholder]
 * @param {string} [props.value]
 * @param {(value: string) => void} [props.onChange]
 * @param {(value: string) => void} [props.onSubmit]
 * @param {Array<{value: string, count?: number}>} [props.suggestions]
 * @param {boolean} [props.showSuggestions]
 * @param {(suggestion: string) => void} [props.onSuggestionSelect]
 * @param {boolean} [props.isLoading]
 * @param {boolean} [props.autoFocus]
 * @param {boolean} [props.showDebugBadge] - Show shared component badge
 */
export function SearchBox({
  className,
  placeholder = 'Search...',
  value,
  onChange,
  onSubmit,
  suggestions = [],
  showSuggestions = true,
  onSuggestionSelect,
  isLoading = false,
  autoFocus = false,
  showDebugBadge = true,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(value || '');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const currentValue = value !== undefined ? value : internalValue;
  const showDropdown = isFocused && showSuggestions && suggestions.length > 0;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    setSelectedIndex(-1);
    onChange?.(newValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionSelect(suggestions[selectedIndex].value);
      } else {
        onSubmit?.(currentValue);
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionSelect = (suggestionValue) => {
    setInternalValue(suggestionValue);
    onChange?.(suggestionValue);
    onSuggestionSelect?.(suggestionValue);
    setIsFocused(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(currentValue);
  };

  return (
    <div className={cn('relative', className)}>
      {showDebugBadge && (
        <SharedBadge package="@repo/search" component="SearchBox" position="top-right" />
      )}
      <form onSubmit={handleSubmit}>
        <div className="relative">
          {/* Search Icon */}
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="search"
            value={currentValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className={cn(
              'w-full rounded-lg border border-neutral-300 bg-white py-2 pl-10 pr-10 text-base',
              'placeholder:text-neutral-400',
              'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
              'transition-colors'
            )}
            {...props}
          />

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="h-5 w-5 animate-spin text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.value}
              type="button"
              onClick={() => handleSuggestionSelect(suggestion.value)}
              className={cn(
                'flex w-full items-center justify-between px-4 py-2 text-left text-sm',
                'hover:bg-neutral-50',
                index === selectedIndex && 'bg-primary-50 text-primary-700'
              )}
            >
              <span>{suggestion.value}</span>
              {suggestion.count !== undefined && (
                <span className="text-xs text-neutral-400">{suggestion.count}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
