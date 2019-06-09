"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Line = _interopRequireDefault(require("../OpenLR/map/Line"));

var _Node = _interopRequireDefault(require("../OpenLR/map/Node"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GeoJsonIntegration =
/*#__PURE__*/
function () {
  function GeoJsonIntegration() {
    _classCallCheck(this, GeoJsonIntegration);
  }

  _createClass(GeoJsonIntegration, null, [{
    key: "initMapDataBase",
    value: function initMapDataBase(mapDataBase, features) {
      var nodesLines = GeoJsonIntegration.getNodesLines(features);
      mapDataBase.setData(nodesLines.lines, nodesLines.nodes); //todo: set bounding box
    }
  }, {
    key: "getNodesLines",
    value: function getNodesLines(features) {
      var openLRLines = {};
      var openLRNodes = {};

      for (var i = 0; i < features.length; i++) {
        if (features[i].geometry.type === "LineString") {
          if (features[i].geometry.coordinates.length >= 2) {
            var lat = features[i].geometry.coordinates[0][1];
            var _long = features[i].geometry.coordinates[0][0];

            if (openLRNodes[lat + "_" + _long] === undefined) {
              openLRNodes[lat + "_" + _long] = new _Node["default"](lat + "_" + _long, lat, _long);
            }

            for (var j = 1; j < features[i].geometry.coordinates.length; j++) {
              lat = features[i].geometry.coordinates[j][1];
              _long = features[i].geometry.coordinates[j][0];

              if (openLRNodes[lat + "_" + _long] === undefined) {
                openLRNodes[lat + "_" + _long] = new _Node["default"](lat + "_" + _long, lat, _long);
              }

              var prevLat = features[i].geometry.coordinates[j - 1][1];
              var prevLong = features[i].geometry.coordinates[j - 1][0];
              openLRLines[prevLat + "_" + prevLong + "_" + lat + "_" + _long] = new _Line["default"](prevLat + "_" + prevLong + "_" + lat + "_" + _long, openLRNodes[prevLat + "_" + prevLong], openLRNodes[lat + "_" + _long]);
              openLRLines[prevLat + "_" + prevLong + "_" + lat + "_" + _long].frc = GeoJsonIntegration.getFRC(features[i].properties);
              openLRLines[prevLat + "_" + prevLong + "_" + lat + "_" + _long].fow = GeoJsonIntegration.getFOW(features[i].properties);
            }
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
    value: function getFRC(properties) {
      return undefined;
    }
  }, {
    key: "getFOW",
    value: function getFOW(properties) {
      return undefined;
    }
  }]);

  return GeoJsonIntegration;
}();

exports["default"] = GeoJsonIntegration;