export async function GET() {
  return Response.json({ status: 'healthy', timestamp: new Date().toISOString(), app: 'release-notes' });
}
