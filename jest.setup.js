const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Add BigInt polyfill for environments that don't support it
if (typeof BigInt === 'undefined') {
  global.BigInt = function(value) {
    return Number(value);
  }
}

// Polyfill for BigInt.prototype.toJSON
if (BigInt.prototype.toJSON === undefined) {
  BigInt.prototype.toJSON = function() {
    return this.toString();
  };
}
