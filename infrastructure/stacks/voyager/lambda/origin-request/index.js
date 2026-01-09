/**
 * Origin Request Lambda@Edge Handler for Voyager SPA
 * Handles SPA routing by rewriting paths without extensions to index.html
 */

'use strict';

exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  const uri = request.uri;

  // If the URI has no extension, or is a path without a file, serve index.html
  // This enables client-side routing for SPAs
  if (!uri.includes('.') || uri.endsWith('/')) {
    request.uri = '/index.html';
  }

  return request;
};
