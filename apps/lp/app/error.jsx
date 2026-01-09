'use client';

import { ErrorPage } from '@repo/ui';

export default function Error({ error, reset }) {
  const isDev = process.env.NODE_ENV === 'development';

  return <ErrorPage error={error} reset={reset} showDetails={isDev} />;
}
