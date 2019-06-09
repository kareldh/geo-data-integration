"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pointToLineDistance = _interopRequireDefault(require("@turf/point-to-line-distance"));

var _nearestPointOnLine = _interopRequireDefault(require("@turf/nearest-point-on-line"));

var _along = _interopRequireDefault(require("@turf/along"));

var _helpers = require("@turf/helpers");

var _index = _interopRequireDefault(require("@turf/distance/index"));

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _Enum = require("./Enum");

var _CoderSettings = require("../coder/CoderSettings");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Line =
/*#__PURE__*/
function () {
  function Line(id, startNode, endNode, options) {
    _classCallCheck(this, Line);

    this.startNode = startNode;
    this.endNode = endNode;
    this.id = id;
    this.fow = _Enum.fowEnum.UNDEFINED;
    this.frc = _Enum.frcEnum.FRC_7;
    this.lineLength = undefined;
    this.turnRestriction = undefined;
    this.bearing = undefined;
    this.reverseBearing = undefined;
    startNode.outgoingLines.push(this);
    endNode.incomingLines.push(this);
    this.internalPrecision = _CoderSettings.configProperties.internalPrecision;
  }

  _createClass(Line, [{
    key: "getStartNode",
    value: function getStartNode() {
      return this.startNode;
    }
  }, {
    key: "getEndNode",
    value: function getEndNode() {
      return this.endNode;
    }
  }, {
    key: "getFOW",
    value: function getFOW() {
      return this.fow;
    }
  }, {
    key: "getFRC",
    value: function getFRC() {
      return this.frc;
    }
  }, {
    key: "getLength",
    value: function getLength() {
      if (this.lineLength === undefined && this.startNode !== undefined && this.endNode !== undefined) {
        var from = (0, _helpers.point)([this.startNode.getLongitudeDeg(), this.startNode.getLatitudeDeg()]);
        var to = (0, _helpers.point)([this.endNode.getLongitudeDeg(), this.endNode.getLatitudeDeg()]);

        if (this.internalPrecision === _Enum.internalPrecisionEnum.CENTIMETER) {
          this.lineLength = Math.round((0, _index["default"])(from, to, {
            units: "centimeters"
          })); //work with integer values in centimeter
        } else {
          this.lineLength = Math.round((0, _index["default"])(from, to, {
            units: "meters"
          })); //work with integer values in meter
        }

        if (this.lineLength === 0) {
          this.lineLength = 1; //but minimum value should be 1
        }
      }

      return this.lineLength;
    }
  }, {
    key: "getID",
    value: function getID() {
      return this.id;
    }
  }, {
    key: "getTurnRestriction",
    value: function getTurnRestriction() {
      return this.turnRestriction;
    }
  }, {
    key: "getGeoCoordinateAlongLine",
    value: function getGeoCoordinateAlongLine(distanceAlong) {
      if (Math.abs(distanceAlong) > this.getLength()) {
        var front = distanceAlong >= 0;
        console.log("Line shorter than " + distanceAlong + ". The latitude and longitude of " + (front ? "startNode" : "endNode") + " are returned");

        if (front) {
          return {
            lat: this.endNode.getLatitudeDeg(),
            "long": this.endNode.getLongitudeDeg()
          };
        } else {
          return {
            lat: this.startNode.getLatitudeDeg(),
            "long": this.startNode.getLongitudeDeg()
          };
        }
      }

      var line = (0, _helpers.lineString)([[this.startNode.getLongitudeDeg(), this.startNode.getLatitudeDeg()], [this.endNode.getLongitudeDeg(), this.endNode.getLatitudeDeg()]]);
      var distAlong;

      if (this.internalPrecision === _Enum.internalPrecisionEnum.CENTIMETER) {
        distAlong = (0, _along["default"])(line, distanceAlong, {
          units: 'centimeters'
        });
      } else {
        distAlong = (0, _along["default"])(line, distanceAlong, {
          units: 'meters'
        });
      } //return distAlong.geometry;


      return {
        lat: distAlong.geometry.coordinates[1],
        "long": distAlong.geometry.coordinates[0]
      };
    }
  }, {
    key: "distanceToPoint",
    value: function distanceToPoint(lat, _long) {
      var pt = (0, _helpers.point)([_long, lat]);
      var line = (0, _helpers.lineString)([[this.startNode.getLongitudeDeg(), this.startNode.getLatitudeDeg()], [this.endNode.getLongitudeDeg(), this.endNode.getLatitudeDeg()]]);

      if (this.internalPrecision === _Enum.internalPrecisionEnum.CENTIMETER) {
        return Math.round((0, _pointToLineDistance["default"])(pt, line, {
          units: 'centimeters'
        }));
      } else {
        return Math.round((0, _pointToLineDistance["default"])(pt, line, {
          units: 'meters'
        }));
      }
    }
  }, {
    key: "measureAlongLine",
    value: function measureAlongLine(lat, _long2) {
      var pt = (0, _helpers.point)([_long2, lat]);
      var line = (0, _helpers.lineString)([[this.startNode.getLongitudeDeg(), this.startNode.getLatitudeDeg()], [this.endNode.getLongitudeDeg(), this.endNode.getLatitudeDeg()]]);
      var snapped = (0, _nearestPointOnLine["default"])(line, pt, {
        units: 'meters'
      });
      return {
        lat: snapped.geometry.coordinates[1],
        "long": snapped.geometry.coordinates[0]
      };
    }
  }, {
    key: "getBearing",
    value: function getBearing() {
      if (this.bearing === undefined) {
        var startNode = (0, _helpers.point)([this.startNode.getLongitudeDeg(), this.startNode.getLatitudeDeg()]);
        var bearPoint;

        if (this.getLength() <= _CoderSettings.configProperties.bearDist * _CoderSettings.configProperties.internalPrecision) {
          bearPoint = (0, _helpers.point)([this.endNode.getLongitudeDeg(), this.endNode.getLatitudeDeg()]);
        } else {
          var bearDistLoc = this.getGeoCoordinateAlongLine(_CoderSettings.configProperties.bearDist * _CoderSettings.configProperties.internalPrecision);
          bearPoint = (0, _helpers.point)([bearDistLoc["long"], bearDistLoc.lat]);
        }

        var calcBear = (0, _bearing["default"])(startNode, bearPoint); // bear is always positive, counterclockwise

        calcBear = (calcBear + 360.0) % 360.0;
        this.bearing = Math.round(calcBear);
      }

      return this.bearing;
    }
  }, {
    key: "getReverseBearing",
    value: function getReverseBearing() {
      if (this.reverseBearing === undefined) {
        var startNode = (0, _helpers.point)([this.endNode.getLongitudeDeg(), this.endNode.getLatitudeDeg()]);
        var bearPoint;

        if (this.getLength() <= _CoderSettings.configProperties.bearDist * _CoderSettings.configProperties.internalPrecision) {
          bearPoint = (0, _helpers.point)([this.startNode.getLongitudeDeg(), this.startNode.getLatitudeDeg()]);
        } else {
          var bearDistLoc = this.getGeoCoordinateAlongLine(this.getLength() - _CoderSettings.configProperties.bearDist * _CoderSettings.configProperties.internalPrecision);
          bearPoint = (0, _helpers.point)([bearDistLoc["long"], bearDistLoc.lat]);
        }

        var calcBear = (0, _bearing["default"])(startNode, bearPoint); // bear is always positive, counterclockwise

        calcBear = (calcBear + 360.0) % 360.0;
        this.reverseBearing = Math.round(calcBear);
      }

      return this.reverseBearing;
    }
  }]);

  return Line;
}();

exports["default"] = Line;