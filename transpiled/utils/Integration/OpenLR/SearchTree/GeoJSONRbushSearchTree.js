"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _geojsonRbush = _interopRequireDefault(require("geojson-rbush"));

var _helpers = require("@turf/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GeoJSONRbushSearchTree =
/*#__PURE__*/
function () {
  function GeoJSONRbushSearchTree() {
    _classCallCheck(this, GeoJSONRbushSearchTree);

    this.tree = (0, _geojsonRbush["default"])();
  }

  _createClass(GeoJSONRbushSearchTree, [{
    key: "addData",
    value: function addData(data) {
      this.tree.load(data);
    } //todo: remove data
    //dist given in meters
    //uses an approximate square bounding box around the given point, so it is possible that nodes/lines/data are returned that
    //are further than dist away. It is still necessary to iterate the returned nodes/lines/data and calculate their real distance.

  }, {
    key: "findCloseBy",
    value: function findCloseBy(lat, _long, dist) {
      var earthRadius = 6371000;
      var latDiff = this.toDegrees(dist / earthRadius);
      var longDiff = this.toDegrees(dist / (Math.cos(this.toRadians(lat)) * earthRadius));
      var latUpper = lat + latDiff;
      var latLower = lat - latDiff;
      var longUpper = _long + longDiff;
      var longLower = _long - longDiff;
      var p = (0, _helpers.polygon)([[[longLower, latLower], [longLower, latUpper], [longUpper, latUpper], [longUpper, latLower], [longLower, latLower]]]);
      var r = this.tree.search(p);
      return r.features;
    }
  }, {
    key: "toRadians",
    value: function toRadians(degrees) {
      return degrees * Math.PI / 180;
    }
  }, {
    key: "toDegrees",
    value: function toDegrees(radians) {
      return radians / Math.PI * 180;
    }
  }]);

  return GeoJSONRbushSearchTree;
}();

exports["default"] = GeoJSONRbushSearchTree;