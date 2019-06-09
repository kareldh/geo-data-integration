"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MapDataBase =
/*#__PURE__*/
function () {
  function MapDataBase() {
    var lines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var nodes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var boundingBox = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      left: undefined,
      top: undefined,
      right: undefined,
      bottom: undefined
    };
    var turnRestrictions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    _classCallCheck(this, MapDataBase);

    this.numberOfNodes = lines.length;
    this.numberOfLines = nodes.length;
    this.turnResctrictions = turnRestrictions;
    this.mapBoundingBox = boundingBox;
    this.lines = lines;
    this.nodes = nodes;
  }

  _createClass(MapDataBase, [{
    key: "setData",
    value: function setData() {
      var lines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var nodes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var boundingBox = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
        left: undefined,
        top: undefined,
        right: undefined,
        bottom: undefined
      };
      var turnRestrictions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      this.numberOfNodes = lines.length;
      this.numberOfLines = nodes.length;
      this.turnResctrictions = turnRestrictions;
      this.mapBoundingBox = boundingBox;
      this.lines = lines;
      this.nodes = nodes;
    }
  }, {
    key: "hasTurnRestrictions",
    value: function hasTurnRestrictions() {
      return this.turnResctrictions;
    }
  }, {
    key: "getLine",
    value: function getLine(id) {
      return this.lines[id];
    }
  }, {
    key: "getNode",
    value: function getNode(id) {
      return this.nodes[id];
    } //todo: versnellen via custom gegevensstructuur?

  }, {
    key: "findNodesCloseByCoordinate",
    value: function findNodesCloseByCoordinate(lat, _long, dist) {
      var resNodes = [];

      for (var key in this.nodes) {
        if (this.nodes.hasOwnProperty(key)) {
          var distance = this.nodes[key].getDistance(lat, _long);

          if (distance <= dist) {
            resNodes.push({
              node: this.nodes[key],
              dist: distance
            });
          }
        }
      }

      return resNodes;
    } //todo: versnellen via custom gegevensstructuur

  }, {
    key: "findLinesCloseByCoordinate",
    value: function findLinesCloseByCoordinate(lat, _long2, dist) {
      var resLines = [];

      for (var key in this.lines) {
        if (this.lines.hasOwnProperty(key)) {
          var distance = this.lines[key].distanceToPoint(lat, _long2);

          if (distance <= dist) {
            resLines.push({
              line: this.lines[key],
              dist: distance
            });
          }
        }
      }

      return resLines;
    }
  }, {
    key: "hasTurnRestrictionOnPath",
    value: function hasTurnRestrictionOnPath(lineList) {
      //todo: how to implement turn restrictions? is it a property of nodes or of lines or both?
      if (!this.turnResctrictions) {
        //if database has no turn restrictions, a line should also have no turn restrictions
        return this.turnResctrictions;
      } //https://wiki.openstreetmap.org/wiki/Relation:restriction


      var i = 0;

      while (i < lineList.length && lineList[i].getTurnRestriction() !== undefined) {
        i++;
      }

      return i === lineList.length;
    }
  }, {
    key: "getAllNodes",
    value: function getAllNodes() {
      return this.nodes;
    }
  }, {
    key: "getAllLines",
    value: function getAllLines() {
      return this.lines;
    }
  }, {
    key: "getMapBoundingBox",
    value: function getMapBoundingBox() {
      return this.mapBoundingBox;
    }
  }, {
    key: "getNumberOfNodes",
    value: function getNumberOfNodes() {
      return this.numberOfNodes;
    }
  }, {
    key: "getNumberOfLines",
    value: function getNumberOfLines() {
      return this.numberOfLines;
    }
  }, {
    key: "addNode",
    value: function addNode(node) {
      this.nodes[node.id] = node;
    }
  }, {
    key: "addLine",
    value: function addLine(line) {
      this.lines[line.id] = line;
    }
  }]);

  return MapDataBase;
}();

exports["default"] = MapDataBase;