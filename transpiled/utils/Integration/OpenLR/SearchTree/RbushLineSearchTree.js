"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _rbush = _interopRequireDefault(require("rbush"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RbushLineSearchTree =
/*#__PURE__*/
function () {
  function RbushLineSearchTree(lines) {
    _classCallCheck(this, RbushLineSearchTree);

    this.tree = (0, _rbush["default"])();
    this.addLines(lines);
  } //one line === Line object


  _createClass(RbushLineSearchTree, [{
    key: "addLines",
    value: function addLines(lines) {
      var data = []; //todo: this could already be made in the openlr integration classes

      for (var id in lines) {
        if (lines.hasOwnProperty(id)) {
          if (lines[id].getStartNode() === undefined || lines[id].getEndNode() === undefined) {
            throw lines[id];
          }

          var minLat = void 0;
          var minLong = void 0;
          var maxLat = void 0;
          var maxLong = void 0;

          if (lines[id].getStartNode().getLatitudeDeg() < lines[id].getEndNode().getLatitudeDeg()) {
            minLat = lines[id].getStartNode().getLatitudeDeg();
            maxLat = lines[id].getEndNode().getLatitudeDeg();
          } else {
            minLat = lines[id].getEndNode().getLatitudeDeg();
            maxLat = lines[id].getStartNode().getLatitudeDeg();
          }

          if (lines[id].getStartNode().getLongitudeDeg() < lines[id].getEndNode().getLongitudeDeg()) {
            minLong = lines[id].getStartNode().getLongitudeDeg();
            maxLong = lines[id].getEndNode().getLongitudeDeg();
          } else {
            minLong = lines[id].getEndNode().getLongitudeDeg();
            maxLong = lines[id].getStartNode().getLongitudeDeg();
          }

          data.push({
            minX: minLong,
            minY: minLat,
            maxX: maxLong,
            maxY: maxLat,
            properties: {
              id: id
            }
          });
        }
      }

      this.tree.load(data);
    } //one line === { minX: minLong, minY: minLat, maxX: maxLong, maxY: maxLat, id: id }

  }, {
    key: "addData",
    value: function addData(data) {
      this.tree.load(data);
    } //todo: remove lines
    //dist given in meters
    //uses an approximate square bounding box around the given point, so it is possible that lines are returned that
    //are further than dist away. It is still necessary to iterate the returned lines and calculate their real distance.

  }, {
    key: "findCloseBy",
    value: function findCloseBy(lat, _long, dist) {
      var earthRadius = 6371000;
      var latDiff = this.toDegrees(dist / earthRadius);
      var longDiff = this.toDegrees(dist / (Math.cos(this.toRadians(lat)) * earthRadius));
      var foundLines = [];
      var latUpper = lat + latDiff;
      var latLower = lat - latDiff;
      var longUpper = _long + longDiff;
      var longLower = _long - longDiff;
      var latOverflow = latUpper > 90;
      var latUnderflow = latLower < -90;
      var longOverflow = longUpper > 180;
      var longUnderflow = longLower < -180;

      if (latOverflow && latUnderflow || longOverflow || longUnderflow) {
        console.error("Given distance is to long and would cover all nodes. All nodes are returned.");
        return this.tree.all();
      }

      if (!latOverflow && !latUnderflow && !longOverflow && !longUnderflow) {
        Array.prototype.push.apply(foundLines, this.tree.search({
          minX: longLower,
          minY: latLower,
          maxX: longUpper,
          maxY: latUpper
        }));
      } else {
        var bottomLatMin;
        var bottomLatMax;
        var topLatMin;
        var topLatMax;
        var leftLongMin;
        var leftLongMax;
        var rightLongMin;
        var rightLongMax;

        if (latOverflow) {
          bottomLatMin = latLower;
          bottomLatMax = 90;
          topLatMin = -90;
          topLatMax = -90 + (latUpper - 90);
        }

        if (longOverflow) {
          leftLongMin = longLower;
          leftLongMax = 180;
          rightLongMin = -180;
          rightLongMax = -180 + (longUpper - 180);
        }

        if (latUnderflow) {
          bottomLatMin = 90 + (latLower + 90);
          bottomLatMax = 90;
          topLatMin = -90;
          topLatMax = latUpper;
        }

        if (longUnderflow) {
          leftLongMin = 90 + (latLower + 90);
          leftLongMax = 180;
          rightLongMin = -180;
          rightLongMax = longUpper;
        }

        if (latOverflow && (longUnderflow || longOverflow) || latUnderflow && (longUnderflow || longOverflow)) {
          Array.prototype.push.apply(foundLines, this.tree.search({
            minX: leftLongMin,
            minY: bottomLatMin,
            maxX: leftLongMax,
            maxY: bottomLatMax
          }));
          Array.prototype.push.apply(foundLines, this.tree.search({
            minX: rightLongMin,
            minY: bottomLatMin,
            maxX: rightLongMax,
            maxY: bottomLatMax
          }));
          Array.prototype.push.apply(foundLines, this.tree.search({
            minX: rightLongMin,
            minY: topLatMin,
            maxX: rightLongMax,
            maxY: topLatMax
          }));
          Array.prototype.push.apply(foundLines, this.tree.search({
            minX: leftLongMin,
            minY: topLatMin,
            maxX: leftLongMax,
            maxY: topLatMax
          }));
        } else if (latOverflow || latUnderflow) {
          Array.prototype.push.apply(foundLines, this.tree.search({
            minX: longLower,
            minY: bottomLatMin,
            maxX: longUpper,
            maxY: bottomLatMax
          }));
          Array.prototype.push.apply(foundLines, this.tree.search({
            minX: longLower,
            minY: topLatMin,
            maxX: longUpper,
            maxY: topLatMax
          }));
        } else if (longOverflow || longUnderflow) {
          Array.prototype.push.apply(foundLines, this.tree.search({
            minX: rightLongMin,
            minY: latLower,
            maxX: rightLongMax,
            maxY: latUpper
          }));
          Array.prototype.push.apply(foundLines, this.tree.search({
            minX: leftLongMin,
            minY: latLower,
            maxX: leftLongMax,
            maxY: latUpper
          }));
        }
      }

      return foundLines;
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

  return RbushLineSearchTree;
}();

exports["default"] = RbushLineSearchTree;