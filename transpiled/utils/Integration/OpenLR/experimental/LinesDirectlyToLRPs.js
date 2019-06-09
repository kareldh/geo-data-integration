"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LinesDirectlyToLRPs = LinesDirectlyToLRPs;

var _LRPNodeHelper = _interopRequireDefault(require("../coder/LRPNodeHelper"));

var _Enum = require("../map/Enum");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * function that takes lines and directly makes LRPs of them, without running through all the encoding steps
 * Can be used to skip the encoding completely. These LRPs can be decoded, but lack the benefit of the encoding.
 * The encoding step reduces the amount of LRPs to the bare minimum, which doesn't happen when using this method.
 * So if this method is used on 20 lines of which only the very first and last end points are valid, this method will return
 * 20 LRPs, wile the encoding would only return 2 LRPs. So use this method only on a small amount of lines.
 * @param lines
 * @returns {{LRPs: *, posOffset: number, negOffset: number, type: number}}
 * @constructor
 */
function LinesDirectlyToLRPs(lines) {
  if (lines.length === 0) {
    throw Error("The array of lines is empty");
  }

  var shortestPaths = [];
  var encLines = lines.length >= 2 ? lines : [lines[0], lines[0]];

  for (var i = 0; i < encLines.length - 1; i++) {
    shortestPaths.push({
      lines: [],
      length: 0
    });
  }

  return {
    LRPs: _LRPNodeHelper["default"].lrpLinesToLRPs(encLines, shortestPaths),
    posOffset: 0,
    negOffset: 0,
    type: _Enum.locationTypeEnum.LINE_LOCATION
  };
}