/**
 * Health check API route (Pages Router)
 */
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    app: 'docs',
    version: process.env.APP_VERSION || '0.0.0',
    nextVersion: '15.0.0',
    router: 'pages',
  });
}
