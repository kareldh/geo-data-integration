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

var OSMIntegration =
/*#__PURE__*/
function () {
  function OSMIntegration() {
    _classCallCheck(this, OSMIntegration);
  }

  _createClass(OSMIntegration, null, [{
    key: "initMapDataBase",
    value: function initMapDataBase(mapDataBase, nodes, ways, relations) {
      var nodesLines = OSMIntegration.getNodesLines(nodes, ways, relations);
      mapDataBase.setData(nodesLines.lines, nodesLines.nodes); //todo: set bounding box
    }
  }, {
    key: "getNodesLines",
    value: function getNodesLines(nodes, ways, relations) {
      var openLRLines = {};
      var openLRNodes = {};
      var osmNodes = {};

      for (var id in nodes) {
        if (nodes.hasOwnProperty(id)) {
          var openLRNode = new _Node["default"](id, nodes[id]["@_lat"], nodes[id]["@_lon"]);
          osmNodes[openLRNode.getID()] = openLRNode;
        }
      }

      for (var _id in ways) {
        if (ways.hasOwnProperty(_id)) {
          for (var i = 0; i < ways[_id].nd.length - 1; i++) {
            // add a line from this node to the next one
            // the id of the line is created out of the id of the way + underscore + id of the start node (since these lines aren't directly identified in osm)
            var openLRLine = new _Line["default"](_id + "_" + ways[_id].nd[i]["@_ref"], osmNodes[ways[_id].nd[i]["@_ref"]], osmNodes[ways[_id].nd[i + 1]["@_ref"]]);
            openLRLine.frc = OSMIntegration.getFRC(ways[_id]);
            openLRLine.fow = OSMIntegration.getFOW(ways[_id]);
            openLRLines[openLRLine.getID()] = openLRLine; // check if OSM does specify if this is strictly a one way street

            var oneWay = false;

            if (Array.isArray(ways[_id].tag)) {
              var _i = 0;
              var oneWayTagFound = false;

              while (!oneWayTagFound && _i < ways[_id].tag.length) {
                if (ways[_id].tag[_i]["@_k"] === "oneway") {
                  oneWayTagFound = true;

                  if (ways[_id].tag[_i]["@_v"] === "yes") {
                    oneWay = true;
                  }
                }

                _i++;
              }
            } else if (ways[_id].tag["@_k"] === "oneway" && ways[_id].tag["@_v"] === "yes") {
              oneWay = true;
            }

            if (!oneWay) {
              // since OSM doesn't have directed lines for it's roads, we will add the line in the other direction, so it is always present both as an input line and an output line in a node
              var reverseOpenLRLine = new _Line["default"](_id + "_" + ways[_id].nd[i]["@_ref"] + "_1", osmNodes[ways[_id].nd[i + 1]["@_ref"]], osmNodes[ways[_id].nd[i]["@_ref"]]);
              reverseOpenLRLine.frc = OSMIntegration.getFRC(ways[_id]);
              reverseOpenLRLine.fow = OSMIntegration.getFOW(ways[_id]);
              openLRLines[reverseOpenLRLine.getID()] = reverseOpenLRLine;
            } //since we only want to keep the nodes that are part of the road network, and not the other nodes of OSM, so we will add only those in the openLRNodes map


            openLRNodes[ways[_id].nd[i]["@_ref"]] = osmNodes[ways[_id].nd[i]["@_ref"]];
            openLRNodes[ways[_id].nd[i + 1]["@_ref"]] = osmNodes[ways[_id].nd[i + 1]["@_ref"]];
          }
        }
      }

      return {
        nodes: openLRNodes,
        lines: openLRLines
      };
    }
    /*depricated, old code, only used to test that one way doesn't affect lanes that aren't one way only*/

  }, {
    key: "initMapDataBaseDeprecatedNoOneWay",
    value: function initMapDataBaseDeprecatedNoOneWay(mapDataBase, nodes, ways, relations) {
      var nodesLines = OSMIntegration.getNodesLinesDeprecatedNoOneWay(nodes, ways, relations);
      mapDataBase.setData(nodesLines.lines, nodesLines.nodes);
    }
  }, {
    key: "getNodesLinesDeprecatedNoOneWay",
    value: function getNodesLinesDeprecatedNoOneWay(nodes, ways, realtions) {
      var openLRLines = {};
      var openLRNodes = {};
      var osmNodes = {};

      for (var id in nodes) {
        if (nodes.hasOwnProperty(id)) {
          var openLRNode = new _Node["default"](id, nodes[id]["@_lat"], nodes[id]["@_lon"]);
          osmNodes[openLRNode.getID()] = openLRNode;
        }
      }

      for (var _id2 in ways) {
        if (ways.hasOwnProperty(_id2)) {
          for (var i = 0; i < ways[_id2].nd.length - 1; i++) {
            // add a line from this node to the next one
            // the id of the line is created out of the id of the way + underscore + id of the start node (since these lines aren't directly identified in osm)
            var openLRLine = new _Line["default"](_id2 + "_" + ways[_id2].nd[i]["@_ref"], osmNodes[ways[_id2].nd[i]["@_ref"]], osmNodes[ways[_id2].nd[i + 1]["@_ref"]]);
            openLRLine.frc = OSMIntegration.getFRC(ways[_id2]);
            openLRLine.fow = OSMIntegration.getFOW(ways[_id2]);
            openLRLines[openLRLine.getID()] = openLRLine; // since OSM doesn't have directed lines for it's roads, we will add the line in the other direction, so it is always present both as an input line and an output line in a node

            var reverseOpenLRLine = new _Line["default"](_id2 + "_" + ways[_id2].nd[i]["@_ref"] + "_1", osmNodes[ways[_id2].nd[i + 1]["@_ref"]], osmNodes[ways[_id2].nd[i]["@_ref"]]);
            reverseOpenLRLine.frc = OSMIntegration.getFRC(ways[_id2]);
            reverseOpenLRLine.fow = OSMIntegration.getFOW(ways[_id2]);
            openLRLines[reverseOpenLRLine.getID()] = reverseOpenLRLine; //since we only want to keep the nodes that are part of the road network, and not the other nodes of OSM, so we will add only those in the openLRNodes map

            openLRNodes[ways[_id2].nd[i]["@_ref"]] = osmNodes[ways[_id2].nd[i]["@_ref"]];
            openLRNodes[ways[_id2].nd[i + 1]["@_ref"]] = osmNodes[ways[_id2].nd[i + 1]["@_ref"]];
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
      var value = OSMIntegration._getTagsValues(osmWay, "highway");

      if (value["highway"] !== undefined && _OsmFrcHighwayMapping.OsmFrcHighwayMapping[value["highway"]] !== undefined) {
        return _OsmFrcHighwayMapping.OsmFrcHighwayMapping[value["highway"]];
      } else {
        return _Enum.frcEnum.FRC_7;
      }
    }
  }, {
    key: "getFOW",
    value: function getFOW(osmWay) {
      var value = OSMIntegration._getTagsValues(osmWay, "highway", "junction", "area"); // if(value["highway"] !== undefined
      //     && value["highway"] === "pedestrian"
      //     && value["area"] !== undefined
      //     && value["area"] === "yes")
      // {
      //     return fowEnum.TRAFFICSQUARE; //todo: is dit wel correct?
      // }
      // else


      if (value["junction"] !== undefined && value["junction"] === "roundabout") {
        return _Enum.fowEnum.ROUNDABOUT;
      } else if (value["highway"] !== undefined && _OsmFowHighwayMapping.OsmFowHighwayMapping[value["highway"]] !== undefined) {
        return _OsmFowHighwayMapping.OsmFowHighwayMapping[value["highway"]];
      } else {
        return _Enum.fowEnum.UNDEFINED;
      }
    }
  }, {
    key: "_getTagsValues",
    value: function _getTagsValues(osmWay, tags) {
      var value = {};

      if (Array.isArray(osmWay.tag)) {
        var i = 0;

        while (i < osmWay.tag.length) {
          if (tags.includes(osmWay.tag[i]["@_k"])) {
            if (value[osmWay.tag[i]["@_k"]] !== undefined) {
              console.warn("Multiple '", osmWay.tag[i]["@_k"], "' tags found for way:", osmWay);
            }

            value[osmWay.tag[i]["@_k"]] = osmWay.tag[i]["@_v"];
          }

          i++;
        }
      } else if (tags.includes(osmWay.tag["@_k"])) {
        value[osmWay.tag["@_k"]] = osmWay.tag["@_v"];
      }

      return value;
    }
  }]);

  return OSMIntegration;
}();

exports["default"] = OSMIntegration;