// lib/logger.js
let isVerbose = false;

/**
 * Configure whether debug logs are enabled.
 * @param {boolean} verbose
 */
export function configureLogger(verbose) {
  isVerbose = verbose;
}

/** General informational messages */
export function info(msg) {
  console.log(`  ${msg}`);
}

/** Warnings that aren’t fatal */
export function warn(msg) {
  console.warn(`  ${msg}`);
}

/** Errors—use this just before exiting */
export function error(msg) {
  console.error(`  ${msg}`);
}

/** Debug logs, only if verbose is on */
export function debug(msg) {
  if (isVerbose) {
    console.debug(` ${msg}`);
  }
}
