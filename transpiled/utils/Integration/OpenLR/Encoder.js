"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Enum = require("./map/Enum");

var _LineEncoder = _interopRequireDefault(require("./coder/LineEncoder"));

var _JsonFormat = _interopRequireDefault(require("./coder/JsonFormat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OpenLREncoder =
/*#__PURE__*/
function () {
  function OpenLREncoder() {
    _classCallCheck(this, OpenLREncoder);
  }

  _createClass(OpenLREncoder, null, [{
    key: "encode",
    value: function encode(location, mapDataBase) {
      if (location.type === _Enum.locationTypeEnum.LINE_LOCATION) {
        var encoded = _LineEncoder["default"].encode(mapDataBase, location.locationLines, location.posOffset, location.negOffset); // let result = JsonFormat.exportJson(locationTypeEnum.LINE_LOCATION,encoded.LRPs,encoded.posOffset,encoded.negOffset); //todo, should not happen here, but higher up


        return encoded;
      }
    }
  }]);

  return OpenLREncoder;
}();

exports["default"] = OpenLREncoder;