import '@/styles/globals.css';
import { AnalyticsProvider, createMockConfig } from '@repo/analytics';
import Layout from '@/components/Layout';

/**
 * Custom App component (Pages Router)
 * This demonstrates Next.js 15 with Pages Router
 */
export default function App({ Component, pageProps }) {
  const analyticsConfig = createMockConfig({
    debug: process.env.NODE_ENV === 'development',
  });

  // Use custom layout if specified
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <AnalyticsProvider config={analyticsConfig}>
      {getLayout(<Component {...pageProps} />)}
    </AnalyticsProvider>
  );
}
