/**
 * Turborepo Remote Cache API Lambda Handler
 *
 * Implements the Turborepo remote cache protocol:
 * - PUT /v8/artifacts/:hash - Upload artifact
 * - GET /v8/artifacts/:hash - Download artifact
 * - POST /v8/artifacts/events - Record events
 * - GET /v8/artifacts/status - Check connection
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({});
const BUCKET = process.env.CACHE_BUCKET;
const TOKEN = process.env.TURBO_TOKEN;

/**
 * Validate the bearer token
 * @param {Object} event - API Gateway event
 * @returns {boolean}
 */
function validateToken(event) {
  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  if (!authHeader) return false;

  const token = authHeader.replace(/^Bearer\s+/i, '');
  return token === TOKEN;
}

/**
 * Get team ID from query params or headers
 * @param {Object} event
 * @returns {string}
 */
function getTeamId(event) {
  return (
    event.queryStringParameters?.teamId ||
    event.queryStringParameters?.slug ||
    event.headers?.['x-turbo-team'] ||
    'default'
  );
}

/**
 * Build S3 key from hash and team
 * @param {string} teamId
 * @param {string} hash
 * @returns {string}
 */
function buildKey(teamId, hash) {
  return `${teamId}/${hash}`;
}

/**
 * Lambda handler
 * @param {Object} event - API Gateway v2 event
 * @returns {Promise<Object>}
 */
export async function handler(event) {
  const { requestContext, pathParameters, body, isBase64Encoded } = event;
  const method = requestContext?.http?.method || event.httpMethod;
  const path = requestContext?.http?.path || event.path;

  // CORS preflight
  if (method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type, x-artifact-tag',
      },
    };
  }

  // Health check / status endpoint
  if (path === '/v8/artifacts/status' || path === '/') {
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'enabled' }),
    };
  }

  // Validate token for all other endpoints
  if (!validateToken(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  const teamId = getTeamId(event);

  // Events endpoint (just acknowledge)
  if (path === '/v8/artifacts/events') {
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  }

  // Extract hash from path
  const hashMatch = path.match(/\/v8\/artifacts\/([a-f0-9]+)/);
  if (!hashMatch) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid path' }),
    };
  }

  const hash = hashMatch[1];
  const key = buildKey(teamId, hash);

  try {
    // GET - Download artifact
    if (method === 'GET') {
      try {
        // Check if artifact exists
        await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));

        // Generate presigned URL for download
        const url = await getSignedUrl(
          s3,
          new GetObjectCommand({ Bucket: BUCKET, Key: key }),
          { expiresIn: 60 }
        );

        return {
          statusCode: 302,
          headers: { Location: url },
        };
      } catch (err) {
        if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
          return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) };
        }
        throw err;
      }
    }

    // PUT - Upload artifact
    if (method === 'PUT') {
      const artifactTag = event.headers?.['x-artifact-tag'];
      const contentType = event.headers?.['content-type'] || 'application/octet-stream';

      // Decode body if base64 encoded
      const buffer = isBase64Encoded
        ? Buffer.from(body, 'base64')
        : Buffer.from(body || '');

      const metadata = {};
      if (artifactTag) {
        metadata['artifact-tag'] = artifactTag;
      }

      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: buffer,
          ContentType: contentType,
          Metadata: metadata,
        })
      );

      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, hash }),
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}
