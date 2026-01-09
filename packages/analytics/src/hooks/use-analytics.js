'use client';

import { useCallback } from 'react';

import { getAnalyticsClient } from '../client.js';

/**
 * Hook to access analytics tracking functions
 * @returns {Object} Analytics methods
 */
export function useAnalytics() {
  const track = useCallback((name, properties) => {
    const client = getAnalyticsClient();
    client?.track(name, properties);
  }, []);

  const page = useCallback((path, properties) => {
    const client = getAnalyticsClient();
    client?.page(path, properties);
  }, []);

  const identify = useCallback((userId, traits) => {
    const client = getAnalyticsClient();
    client?.identify(userId, traits);
  }, []);

  const reset = useCallback(() => {
    const client = getAnalyticsClient();
    client?.reset();
  }, []);

  return {
    track,
    page,
    identify,
    reset,
  };
}

/**
 * Helper hook to track specific events
 * @param {string} eventName - Default event name
 * @returns {(properties?: Object) => void}
 */
export function useTrackEvent(eventName) {
  const { track } = useAnalytics();

  return useCallback(
    (properties) => {
      track(eventName, properties);
    },
    [track, eventName]
  );
}
