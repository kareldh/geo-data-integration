"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _distance = _interopRequireDefault(require("@turf/distance"));

var _helpers = require("@turf/helpers");

var _CoderSettings = require("../coder/CoderSettings");

var _Enum = require("./Enum");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Node =
/*#__PURE__*/
function () {
  function Node() {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var lat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var _long = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var incomingLines = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    var outgoingLines = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

    _classCallCheck(this, Node);

    this.id = id;
    this.lat = lat;
    this["long"] = _long;
    this.incomingLines = incomingLines;
    this.outgoingLines = outgoingLines;
    this.setLines(incomingLines, outgoingLines);
    this.internalPrecision = _CoderSettings.configProperties.internalPrecision;
  }

  _createClass(Node, [{
    key: "setLines",
    value: function setLines(incomingLines, outgoingLines) {
      this.incomingLines = incomingLines;
      this.outgoingLines = outgoingLines;
    }
  }, {
    key: "getLatitudeDeg",
    value: function getLatitudeDeg() {
      return this.lat;
    }
  }, {
    key: "getLongitudeDeg",
    value: function getLongitudeDeg() {
      return this["long"];
    }
  }, {
    key: "getOutgoingLines",
    value: function getOutgoingLines() {
      return this.outgoingLines;
    }
  }, {
    key: "getIncomingLines",
    value: function getIncomingLines() {
      return this.incomingLines;
    }
  }, {
    key: "getID",
    value: function getID() {
      return this.id;
    }
  }, {
    key: "getDistance",
    value: function getDistance(lat, _long2) {
      var from = (0, _helpers.point)([this["long"], this.lat]);
      var to = (0, _helpers.point)([_long2, lat]);

      if (this.internalPrecision === _Enum.internalPrecisionEnum.CENTIMETER) {
        return Math.round((0, _distance["default"])(from, to, {
          units: "centimeters"
        }));
      } else {
        return Math.round((0, _distance["default"])(from, to, {
          units: "meters"
        }));
      }
    }
  }]);

  return Node;
}();

exports["default"] = Node;