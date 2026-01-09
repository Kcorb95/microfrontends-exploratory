import { ErrorPage } from '@repo/ui';

function Error({ statusCode, err }) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <ErrorPage
      title={statusCode ? `${statusCode} Error` : 'An error occurred'}
      description={
        statusCode === 404
          ? "The page you're looking for doesn't exist."
          : statusCode
            ? `A ${statusCode} error occurred on the server.`
            : 'An error occurred on the client.'
      }
      error={err}
      showDetails={isDev}
    />
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode, err };
};

export default Error;
