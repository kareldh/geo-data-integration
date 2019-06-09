"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Line = _interopRequireDefault(require("../OpenLR/map/Line"));

var _Node = _interopRequireDefault(require("../OpenLR/map/Node"));

var _Enum = require("../OpenLR/map/Enum");

var _OsmFowHighwayMapping = require("./FOWmappings/OsmFowHighwayMapping");

var _OsmFrcHighwayMapping = require("./FRCmappings/OsmFrcHighwayMapping");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RoutableTilesIntegration =
/*#__PURE__*/
function () {
  function RoutableTilesIntegration() {
    _classCallCheck(this, RoutableTilesIntegration);
  }

  _createClass(RoutableTilesIntegration, null, [{
    key: "initMapDataBase",
    value: function initMapDataBase(mapDataBase, nodes, ways, relations) {
      var nodesLines = RoutableTilesIntegration.getNodesLines(nodes, ways, relations);
      mapDataBase.setData(nodesLines.lines, nodesLines.nodes); //todo: set bounding box
    }
  }, {
    key: "getNodesLines",
    value: function getNodesLines(nodes, ways, relations) {
      //todo: use relations?
      var openLRLines = {};
      var openLRNodes = {};
      var osmNodes = {};
      var refToNodeId = {};

      for (var id in nodes) {
        if (nodes.hasOwnProperty(id)) {
          var openLRNode = new _Node["default"](id, nodes[id].lat, nodes[id]["long"]);
          osmNodes[openLRNode.getID()] = openLRNode;

          for (var i = 0; i < nodes[id].ref.length; i++) {
            refToNodeId[nodes[id].ref[i]] = nodes[id].id;
          }
        }
      }

      for (var _id in ways) {
        if (ways.hasOwnProperty(_id)) {
          for (var _i = 0; _i < ways[_id].nodes.length - 1; _i++) {
            // if(ways[id].highway !== undefined){ //todo: should we filter on highway data?
            // add a line from this node to the next one
            // the id of the line is created out of the id of the way + underscore + id of the start node (since these lines aren't directly identified in RoutableTiles)
            var openLRLine = new _Line["default"](_id + "_" + refToNodeId[ways[_id].nodes[_i]], osmNodes[refToNodeId[ways[_id].nodes[_i]]], osmNodes[refToNodeId[ways[_id].nodes[_i + 1]]]);
            openLRLine.frc = RoutableTilesIntegration.getFRC(ways[_id]);
            openLRLine.fow = RoutableTilesIntegration.getFOW(ways[_id]);
            openLRLines[openLRLine.getID()] = openLRLine;

            if (ways[_id].oneway === undefined || ways[_id].oneway === "osm:no") {
              // since OSM doesn't have directed lines for it's roads, we will add the line in the other direction, so it is always present both as an input line and an output line in a node
              var reverseOpenLRLine = new _Line["default"](_id + "_" + refToNodeId[ways[_id].nodes[_i]] + "_1", osmNodes[refToNodeId[ways[_id].nodes[_i + 1]]], osmNodes[refToNodeId[ways[_id].nodes[_i]]]);
              reverseOpenLRLine.frc = RoutableTilesIntegration.getFRC(ways[_id]);
              reverseOpenLRLine.fow = RoutableTilesIntegration.getFOW(ways[_id]);
              openLRLines[reverseOpenLRLine.getID()] = reverseOpenLRLine;
            } //since we only want to keep the nodes that are part of the road network, and not the other nodes of OSM, so we will add only those in the openLRNodes map


            openLRNodes[refToNodeId[ways[_id].nodes[_i]]] = osmNodes[refToNodeId[ways[_id].nodes[_i]]];
            openLRNodes[refToNodeId[ways[_id].nodes[_i + 1]]] = osmNodes[refToNodeId[ways[_id].nodes[_i + 1]]]; // }
          }
        }
      }

      return {
        nodes: openLRNodes,
        lines: openLRLines
      };
    }
  }, {
    key: "getFRC",
    value: function getFRC(osmWay) {
      if (osmWay.highway !== undefined && _OsmFrcHighwayMapping.OsmFrcHighwayMapping[osmWay.highway.slice(4)] !== undefined) {
        return _OsmFrcHighwayMapping.OsmFrcHighwayMapping[osmWay.highway.slice(37).toLowerCase()];
      } else {
        return _Enum.frcEnum.FRC_7;
      }
    }
  }, {
    key: "getFOW",
    value: function getFOW(osmWay) {
      // if(osmWay.highway !== undefined
      //     && osmWay.highway === "https://w3id.org/openstreetmap/terms#Pedestrian"
      //     && osmWay.area !== undefined
      //     && osmWay.area === "yes"
      // ){
      //     return fowEnum.TRAFFICSQUARE; //todo: is dit wel correct?
      // }
      // else
      if (osmWay.junction !== undefined && osmWay.junction === "roundabout") {
        return _Enum.fowEnum.ROUNDABOUT;
      } else if (osmWay.highway !== undefined && _OsmFowHighwayMapping.OsmFowHighwayMapping[osmWay.highway.slice(37).toLowerCase()] !== undefined) {
        return _OsmFowHighwayMapping.OsmFowHighwayMapping[osmWay.highway.slice(37).toLowerCase()];
      } else {
        return _Enum.fowEnum.UNDEFINED;
      }
    }
  }]);

  return RoutableTilesIntegration;
}();

exports["default"] = RoutableTilesIntegration;