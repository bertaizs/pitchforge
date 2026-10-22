#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

if (process.argv.length !== 4) {
  console.error('Usage: node populate.js <data.json> <template_file>');
  process.exit(1);
}

const jsonPath = path.resolve(process.argv[2]);
const templatePath = path.resolve(process.argv[3]);

/**
 * Resolves value for a given key.
 * If value is an object { "include": "filename" }, reads and returns the file content.
 * Tracks included files to prevent infinite recursive loops.
 */
function resolveValue(data, key, baseDir, visitedFiles = new Set()) {
  if (!Object.prototype.hasOwnProperty.call(data, key)) {
    return null; // Key missing in JSON
  }

  const val = data[key];

  // Case 1: Simple string or primitive value
  if (typeof val !== 'object' || val === null) {
    return String(val);
  }

  // Case 2: Object with {"include": "filename"}
  if (typeof val === 'object' && typeof val.include === 'string') {
    const includeFilePath = path.resolve(baseDir, val.include);

    if (visitedFiles.has(includeFilePath)) {
      throw new Error(`Circular include detected: "${includeFilePath}"`);
    }

    if (!fs.existsSync(includeFilePath)) {
      throw new Error(`Included file not found: "${includeFilePath}" (referenced by key "${key}")`);
    }

    // Read the included file
    const includedContent = fs.readFileSync(includeFilePath, 'utf8');

    // Recursively process placeholders inside the included file
    const nextVisited = new Set(visitedFiles).add(includeFilePath);
    return processTemplate(includedContent, data, path.dirname(includeFilePath), nextVisited);
  }

  // Unsupported object format
  return String(val);
}

/**
 * Replaces all ${key} placeholders in template text.
 */
function processTemplate(templateStr, data, baseDir, visitedFiles = new Set()) {
  return templateStr.replace(/\$\{([^}]+)\}/g, (match, key) => {
    const resolved = resolveValue(data, key.trim(), baseDir, visitedFiles);
    return resolved !== null ? resolved : match;
  });
}

try {
  // Read and parse JSON
  const jsonContent = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(jsonContent);

  // Read primary template
  const templateContent = fs.readFileSync(templatePath, 'utf8');

  // Track root template file in set to prevent self-includes
  const initialVisited = new Set([templatePath]);

  // Process template relative to template file's folder
  const result = processTemplate(templateContent, data, path.dirname(templatePath), initialVisited);

  process.stdout.write(result);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
