'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import { createAnalyticsClient, getAnalyticsClient } from '../client.js';

const AnalyticsContext = createContext(null);

/**
 * Analytics Provider component
 * Initializes analytics and provides context to children
 * @param {Object} props
 * @param {import('../types.js').AnalyticsConfig} props.config - Analytics configuration
 * @param {React.ReactNode} props.children
 */
export function AnalyticsProvider({ config, children }) {
  const client = useMemo(() => {
    return createAnalyticsClient(config);
  }, [config]);

  useEffect(() => {
    client.init();
  }, [client]);

  return (
    <AnalyticsContext.Provider value={client}>
      {children}
    </AnalyticsContext.Provider>
  );
}

/**
 * Hook to get analytics client from context
 * @returns {import('../client.js').AnalyticsClient}
 */
export function useAnalyticsClient() {
  const context = useContext(AnalyticsContext);
  // Fallback to global instance if not in provider
  return context || getAnalyticsClient();
}
