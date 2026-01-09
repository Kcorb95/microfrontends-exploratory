export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    app: 'lp',
    version: process.env.APP_VERSION || '0.0.0',
  });
}
