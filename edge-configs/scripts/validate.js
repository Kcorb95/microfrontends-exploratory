import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const schemas = {
  'routes.json': JSON.parse(fs.readFileSync(path.join(rootDir, 'schemas/routes.schema.json'), 'utf-8')),
  'redirects.json': JSON.parse(fs.readFileSync(path.join(rootDir, 'schemas/redirects.schema.json'), 'utf-8')),
  'config.json': JSON.parse(fs.readFileSync(path.join(rootDir, 'schemas/config.schema.json'), 'utf-8')),
  'csp-domains.json': JSON.parse(fs.readFileSync(path.join(rootDir, 'schemas/csp-domains.schema.json'), 'utf-8')),
  'cors-config.json': JSON.parse(fs.readFileSync(path.join(rootDir, 'schemas/cors-config.schema.json'), 'utf-8')),
  'cache-rules.json': JSON.parse(fs.readFileSync(path.join(rootDir, 'schemas/cache-rules.schema.json'), 'utf-8')),
};

const validators = {};
for (const [name, schema] of Object.entries(schemas)) {
  validators[name] = ajv.compile(schema);
}

// Get environment filter from command line args
const envFilter = process.argv[2];
const environments = envFilter ? [envFilter] : ['production', 'beta', 'preview'];
const distributions = ['www'];

let hasErrors = false;

for (const env of environments) {
  for (const dist of distributions) {
    const configDir = path.join(rootDir, env, dist);

    if (!fs.existsSync(configDir)) {
      console.log(`Skipping ${env}/${dist} (directory not found)`);
      continue;
    }

    console.log(`\nValidating ${env}/${dist}:`);

    for (const [filename, validate] of Object.entries(validators)) {
      const filePath = path.join(configDir, filename);

      if (!fs.existsSync(filePath)) {
        console.log(`  - ${filename}: SKIPPED (file not found)`);
        continue;
      }

      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const valid = validate(data);

        if (valid) {
          console.log(`  - ${filename}: OK`);
        } else {
          console.log(`  - ${filename}: FAILED`);
          console.log(`    Errors: ${JSON.stringify(validate.errors, null, 2)}`);
          hasErrors = true;
        }
      } catch (err) {
        console.log(`  - ${filename}: ERROR`);
        console.log(`    ${err.message}`);
        hasErrors = true;
      }
    }
  }
}

if (hasErrors) {
  console.log('\nValidation FAILED');
  process.exit(1);
} else {
  console.log('\nValidation PASSED');
  process.exit(0);
}
