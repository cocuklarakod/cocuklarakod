const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const schemaPath = path.join(__dirname, '..', 'meta.schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

const projectsDir = path.join(__dirname, '..', 'projects');

let hasError = false;

const projectDirs = fs.existsSync(projectsDir)
  ? fs.readdirSync(projectsDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)
  : [];

if (projectDirs.length === 0) {
  console.log('No projects found in /projects.');
}

for (const dir of projectDirs) {
  const metaPath = path.join(projectsDir, dir, 'meta.json');
  if (!fs.existsSync(metaPath)) {
    console.error(`meta.json not found in project '${dir}'.`);
    hasError = true;
    continue;
  }
  try {
    const data = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const valid = validate(data);
    if (!valid) {
      console.error(`Validation failed for '${dir}':`);
      console.error(validate.errors);
      hasError = true;
    }
  } catch (err) {
    console.error(`Error reading meta.json in project '${dir}': ${err.message}`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
} else {
  console.log('All projects are valid.');
}
