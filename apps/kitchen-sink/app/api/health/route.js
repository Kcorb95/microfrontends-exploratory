/**
 * Health check endpoint for load balancer and monitoring
 */
export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    app: 'core',
    version: process.env.APP_VERSION || '0.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  };

  return Response.json(healthCheck, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
