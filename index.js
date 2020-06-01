/*
# gen doc
npm i jsdoc-to-markdown -g
jsdoc2md index.js
*/

/**
 * @typedef StackItem
 * @type {object}
 * @property {string} method - Name of function on stack
 * @property {number} line - Line number on stack
 * @property {string} file - /PathOfFile/Source/NameOfFilename.js
 * @property {string} filename - NameOfFile
 */

/**
 * @module trace-line
 * @example
 * const traceLine = require('trace-line')
 */

/**
 * @alias module:trace-line
 * @typicalname traceLine
 */
class TraceLine {
  /**
   * Returns a single item
   *
   * @param {number} [level] Useful to return levels up on the stack. If not informed, the first (0, zero index) element of the stack will be returned
   * @returns {StackItem}
   */
  get(level = 0) {
    const stack = getStack();
    const item = stack[level + 1];
    const result = parse(item);
    return result;
  }

  /**
   * Returns all stack
   *
   * @returns {StackItem[]}
   */
  all() {
    const stack = getStack();
    const result = [];
    for (let i = 0; i < stack.length; i++) {
      const item = stack[i];
      result.push(parse(item));
    }
    return result;
  }
}

function getStack() {
  const orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function (_, stack) {
    return stack;
  };
  const err = new Error();
  Error.captureStackTrace(err, arguments.callee);
  const stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
}

function parse(item) {
  const result = {
    method: item.getFunctionName(),
    line: item.getLineNumber(),
    file: item.getFileName(),
  };
  result.filename = result.file.replace(/^.*\/|\\/gm, "").replace(/\.\w+$/gm, "");
  return result;
}

module.exports = new TraceLine();
