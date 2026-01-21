#!/usr/bin/env node

/**
 * Prepare Edge Configs for Deployment
 *
 * This script:
 * 1. Reads all config files from the specified environment
 * 2. Generates a content-based version hash
 * 3. Writes configs to a versioned output directory
 * 4. Outputs the version hash for use in CI/CD
 *
 * Usage:
 *   node prepare-deploy.js <environment> [output-dir]
 *
 * Example:
 *   node prepare-deploy.js production /tmp/edge-configs
 *   # Outputs: abc123def456 (the version hash)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Config files to include in deployment
const CONFIG_FILES = [
  'routes',
  'redirects',
  'config',
  'csp-domains',
  'cors-config',
  'cache-rules'
];

function main() {
  const env = process.argv[2];
  const outputDir = process.argv[3] || '/tmp/edge-configs';

  if (!env) {
    console.error('Usage: node prepare-deploy.js <environment> [output-dir]');
    console.error('Example: node prepare-deploy.js production /tmp/edge-configs');
    process.exit(1);
  }

  const configDir = path.join(__dirname, '..', 'configs', env, 'www');

  if (!fs.existsSync(configDir)) {
    console.error(`Config directory not found: ${configDir}`);
    process.exit(1);
  }

  // Read all config files
  const configs = {};
  for (const name of CONFIG_FILES) {
    const filePath = path.join(configDir, `${name}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        configs[name] = JSON.parse(content);
      } catch (error) {
        console.error(`Error reading ${filePath}: ${error.message}`);
        process.exit(1);
      }
    }
  }

  if (Object.keys(configs).length === 0) {
    console.error(`No config files found in ${configDir}`);
    process.exit(1);
  }

  // Generate version hash from content
  const contentHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(configs, null, 0)) // Deterministic JSON string
    .digest('hex')
    .substring(0, 12);

  // Create versioned output directory
  const versionDir = path.join(outputDir, env, contentHash);
  fs.mkdirSync(versionDir, { recursive: true });

  // Write individual config files
  for (const [name, content] of Object.entries(configs)) {
    const outputPath = path.join(versionDir, `${name}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(content, null, 2));
  }

  // Log summary to stderr (so stdout only has the version hash)
  console.error(`Prepared ${Object.keys(configs).length} configs for ${env}`);
  console.error(`Version: ${contentHash}`);
  console.error(`Output: ${versionDir}`);
  console.error('');
  console.error('Files:');
  for (const name of Object.keys(configs)) {
    console.error(`  - ${name}.json`);
  }

  // Output version hash to stdout for CI/CD capture
  console.log(contentHash);
}

main();
