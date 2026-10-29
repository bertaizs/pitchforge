#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Resolves a key's value from data.
 * If value is { "include": "filename" }, reads and returns the file content.
 * Tracks included files to prevent circular references.
 */
function resolveValue(data, key, baseDir, visitedFiles) {
  if (!Object.prototype.hasOwnProperty.call(data, key)) {
    return null; // Key missing in data
  }

  const val = data[key];

  // Simple string or primitive value
  if (typeof val !== 'object' || val === null) {
    return String(val);
  }

  // Object with {"include": "filename"}
  if (typeof val === 'object' && typeof val.include === 'string') {
    // Resolve relative to provided baseDir (defaults to process.cwd() if not provided)
    const includeFilePath = path.resolve(baseDir || process.cwd(), val.include);

    if (visitedFiles.has(includeFilePath)) {
      throw new Error(`Circular include detected: "${includeFilePath}"`);
    }

    if (!fs.existsSync(includeFilePath)) {
      throw new Error(`Included file not found: "${includeFilePath}" (referenced by key "${key}")`);
    }

    const includedContent = fs.readFileSync(includeFilePath, 'utf8');

    // Recursively process placeholders inside the included file
    const nextVisited = new Set(visitedFiles).add(includeFilePath);
    return processTemplate(
      includedContent,
      data,
      path.dirname(includeFilePath),
      nextVisited
    );
  }

  return String(val);
}

/**
 * Core templating engine function.
 * 
 * @param {string} templateStr - The template contents as a string.
 * @param {Object} data - Key-value pair object (can include {"include": "file.txt"}).
 * @param {string} [baseDir=process.cwd()] - Directory to resolve relative include paths from.
 * @param {Set<string>} [visitedFiles=new Set()] - Set tracking visited file paths for loop detection.
 * @returns {string} The interpolated template string.
 */
function processTemplate(
  templateStr,
  data,
  baseDir = process.cwd(),
  visitedFiles = new Set()
) {
  if (typeof templateStr !== 'string') {
    throw new TypeError('Template must be a string.');
  }
  if (typeof data !== 'object' || data === null) {
    throw new TypeError('Data must be an object.');
  }

  return templateStr.replace(/\$\{([^}]+)\}/g, (match, key) => {
    const resolved = resolveValue(data, key.trim(), baseDir, visitedFiles);
    return resolved !== null ? resolved : match;
  });
}

/**
 * Main function for CLI execution.
 */
function runCLI() {
  if (process.argv.length !== 4) {
    console.error('Usage: node template.js <data.json> <template_file>');
    process.exit(1);
  }

  const jsonPath = path.resolve(process.argv[2]);
  const templatePath = path.resolve(process.argv[3]);

  try {
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(jsonContent);

    const templateContent = fs.readFileSync(templatePath, 'utf8');

    // Track the root template file to prevent self-inclusion loops
    const initialVisited = new Set([templatePath]);

    // Use root template directory as baseDir for resolving included files
    const result = processTemplate(
      templateContent,
      data,
      path.dirname(templatePath),
      initialVisited
    );

    process.stdout.write(result);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Module Export: default export is processTemplate
module.exports = processTemplate;

// CLI Trigger: Execute runCLI() only if run directly from command line
if (require.main === module) {
  runCLI();
}
