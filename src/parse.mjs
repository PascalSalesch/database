/**
 * @file This file parses template literals in sql files.
 */

import * as fs from 'node:fs'

import semver from 'semver'

import utils from './utils.mjs'

// AsyncFunction
const AsyncFunction = (async () => {}).constructor

// get the parser context
const ctx = await getParserContext()

/**
 * Evaluates template literals in a string.
 * @param {string} content - The content of the sql file.
 * @returns {Promise<string>} The parsed content.
 */
export default async function parse (content) {
  const parse = new AsyncFunction(...Object.keys(ctx), 'return `' + content + '`')
  return await parse(...Object.values(ctx))
}

/**
 * @typedef {object} ParserContext
 * @property {object} packageJson - The content of the `package.json`.
 * @property {string} major - The major version defined in the `package.json`.
 * @property {string} minor - The minor version defined in the `package.json`.
 * @property {string} patch - The patch version defined in the `package.json`.
 * @property {string} always - The string "always".
 * @property {string} before - The string "before".
 */

/**
 * Retrieves values that are available in the sql files as template literals.
 * @returns {Promise<ParserContext>} An object whose properties are available in the sql files.
 */
async function getParserContext () {
  const packageJson = JSON.parse(fs.readFileSync(utils.getPackageJson(), { encoding: 'utf-8' }))

  return {
    packageJson,
    major: semver.major(packageJson.version),
    minor: semver.minor(packageJson.version),
    patch: semver.patch(packageJson.version),
    label: packageJson.version.includes('-') ? packageJson.version.split('-').slice(1).join('-') : '',
    always: 'always',
    before: 'before'
  }
}
