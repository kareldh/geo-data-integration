"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _GeoJSONRbushNodeSearchTree = _interopRequireDefault(require("../SearchTree/GeoJSONRbushNodeSearchTree"));

var _GeoJSONRbushLineSearchTree = _interopRequireDefault(require("../SearchTree/GeoJSONRbushLineSearchTree"));

var _CoderSettings = require("../coder/CoderSettings");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

    this.turnResctrictions = turnRestrictions;
    this.mapBoundingBox = boundingBox;
    this.lines = lines;
    this.nodes = nodes;
    this.nodeSearchTree = new _GeoJSONRbushNodeSearchTree["default"](nodes);
    this.lineSearchTree = new _GeoJSONRbushLineSearchTree["default"](lines);
    this.internalPrecision = _CoderSettings.configProperties.internalPrecision;
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
      this.turnResctrictions = turnRestrictions;
      this.mapBoundingBox = boundingBox;
      this.lines = lines;
      this.nodes = nodes;
      this.nodeSearchTree = new _GeoJSONRbushNodeSearchTree["default"](nodes);
      this.lineSearchTree = new _GeoJSONRbushLineSearchTree["default"](lines);
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
    }
  }, {
    key: "findNodesCloseByCoordinate",
    value: function findNodesCloseByCoordinate(lat, _long, dist) {
      var _this = this;

      var resNodes = [];
      var range = Math.round(dist / this.internalPrecision);
      var possibleNodes = this.nodeSearchTree.findCloseBy(lat, _long, range);
      possibleNodes.forEach(function (node) {
        var distance = _this.nodes[node.properties.id].getDistance(lat, _long);

        if (distance <= dist) {
          resNodes.push({
            node: _this.nodes[node.properties.id],
            dist: distance
          });
        }
      });
      return resNodes;
    }
  }, {
    key: "findLinesCloseByCoordinate",
    value: function findLinesCloseByCoordinate(lat, _long2, dist) {
      var _this2 = this;

      var resLines = [];
      var range = Math.round(dist / this.internalPrecision);
      var possibleLines = this.lineSearchTree.findCloseBy(lat, _long2, range);
      possibleLines.forEach(function (line) {
        var distance = _this2.lines[line.properties.id].distanceToPoint(lat, _long2);

        if (distance <= dist) {
          resLines.push({
            line: _this2.lines[line.properties.id],
            dist: distance
          });
        }
      });
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
    key: "addData",
    value: function addData() {
      var lines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var nodes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var boundingBox = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
        left: undefined,
        top: undefined,
        right: undefined,
        bottom: undefined
      };
      //todo: speed this up
      //maybe change lines and nodes to not contain references, but only ids
      var nodesAdded = {};
      var linesAdded = {};

      for (var key in nodes) {
        if (nodes.hasOwnProperty(key)) {
          if (this.nodes[key] === undefined) {
            //this node was not yet present
            this.nodes[key] = nodes[key];
            nodesAdded[key] = nodes[key];
          }
        }
      }

      for (var _key in lines) {
        if (lines.hasOwnProperty(_key)) {
          if (this.lines[_key] === undefined) {
            //this line was not yet present
            lines[_key].startNode = this.nodes[lines[_key].getStartNode().getID()];

            if (nodesAdded[lines[_key].getStartNode().getID()] === undefined) {
              // if this node wasn't just added, this node was already present, so the line should still
              // be added to it's outgoing lines
              this.nodes[lines[_key].getStartNode().getID()].outgoingLines.push(lines[_key]);
            }

            lines[_key].endNode = this.nodes[lines[_key].getEndNode().getID()];

            if (nodesAdded[lines[_key].getEndNode().getID()] === undefined) {
              // if this node wasn't just added, this node was already present, so the line should still
              // be added to it's incoming lines
              this.nodes[lines[_key].getEndNode().getID()].incomingLines.push(lines[_key]);
            }

            this.lines[lines[_key].getID()] = lines[_key];
            linesAdded[_key] = lines[_key];
          }
        }
      }

      this.nodeSearchTree.addNodes(nodesAdded);
      this.lineSearchTree.addLines(linesAdded); //todo: adjust bounding box
    } //todo: remove data

  }]);

  return MapDataBase;
}();

exports["default"] = MapDataBase;