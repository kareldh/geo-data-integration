"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _heap = _interopRequireDefault(require("heap"));

var _Enum = require("../map/Enum");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Dijkstra =
/*#__PURE__*/
function () {
  function Dijkstra() {
    _classCallCheck(this, Dijkstra);
  }

  _createClass(Dijkstra, null, [{
    key: "shortestPath",
    value: function shortestPath(startNode, endNode, options) {
      if (startNode.getID() === endNode.getID()) {
        return {
          lines: [],
          length: 0 //integer value in the unit of internal precision!

        };
      }

      var minLengths = {};
      var followedLine = {};
      var heap = new _heap["default"](function (a, b) {
        if (a[0] < b[0]) {
          return -1;
        }

        if (b[0] < a[0]) {
          return 1;
        }

        return 0;
      }); // push start node on heap with length 0

      heap.push([0, startNode]);
      minLengths[startNode.getID()] = 0;

      var _loop = function _loop() {
        var heapTop = heap.pop();
        var currentNode = heapTop[1];
        currentNode.getOutgoingLines().forEach(function (line) {
          var length = minLengths[currentNode.getID()] + line.getLength();

          if (length < 0) {
            throw Error("negative line length found for line: " + line.getID());
          }

          var validLine = options === undefined || options.lfrcnp === undefined || options.lfrcnpDiff === undefined || line.getFRC() === undefined ? 1 : 0 || line.getFRC() >= _Enum.frcEnum.FRC_0 && line.getFRC() <= _Enum.frcEnum.FRC_7 && line.getFRC() <= options.lfrcnpDiff + options.lfrcnp;

          if (validLine && (minLengths[line.getEndNode().getID()] === undefined || minLengths[line.getEndNode().getID()] > length)) {
            minLengths[line.getEndNode().getID()] = length;
            followedLine[line.getEndNode().getID()] = line;

            if (minLengths[endNode.getID()] === undefined || length < minLengths[endNode.getID()]) {
              // this Dijkstra algorithm is only interested in the shortest path between the startNode and the endNode,
              // not in the shortest paths between the startNode and any other node, so if a length is already longer
              // than the current shortest path to the endNode, we won't push it to the stack
              if (options !== undefined && options.maxDist !== undefined) {
                // if a max distance is given, the shortest path can not be longer than this max distance
                // (which means that nodes that have a eagle's eye distance longer than this max distance)
                // which means that nodes that have a distance that already is longer than this max distance
                // will never be part of the shortest path we want to calculate
                //
                // , and the shortest path foound in this way would always be discarded
                // since the total distance would always be longer than
                // the max distance (which is the distanceToNextLrp + decoderProperties.dist)
                // OR
                // , (when using in Encoder) we know the shortest path we want in advance and calculate it's
                // length (the length between the very first and very last LRP) and use that as the maximum
                //
                // so we can speed up this SP calculation by not taking these nodes into account
                if (length <= options.maxDist) {
                  heap.push([length, line.getEndNode()]);
                }
              } else {
                heap.push([length, line.getEndNode()]);
              }
            }
          }
        });
      };

      while (heap.size() > 0) {
        _loop();
      }

      var shortestPathLines = [];
      var lastStep = endNode;

      while (lastStep.getID() !== startNode.getID() && followedLine[lastStep.getID()] !== undefined) {
        var line = followedLine[lastStep.getID()];
        shortestPathLines.unshift(line);
        lastStep = line.getStartNode();
      } //if length is 0, and lines = [], the startnode was equal to the endnode
      //if length is undefined and lines = [], there isn't a path between the startnode and endnode


      if (minLengths[endNode.getID()] === 0) {
        throw Error("Something went wrong during Shortest Path calculation, probably because lines exist with 0 or negative lengths");
      }

      return {
        lines: shortestPathLines,
        length: minLengths[endNode.getID()] //integer value in meter!

      };
    }
  }]);

  return Dijkstra;
}();

exports["default"] = Dijkstra;