"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Enum = require("../map/Enum");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var JsonFormat =
/*#__PURE__*/
function () {
  function JsonFormat() {
    _classCallCheck(this, JsonFormat);
  }

  _createClass(JsonFormat, null, [{
    key: "exportJson",
    value: function exportJson(type, LRPs, posOffset, negOffset) {
      if (type === _Enum.locationTypeEnum.LINE_LOCATION) {
        return this.exportLineLocation(LRPs, posOffset, negOffset);
      }
    }
  }, {
    key: "exportLineLocation",
    value: function exportLineLocation(LRPs, posOffset, negOffset) {
      var jsonObj = {
        "type": "RawLineLocationReference",
        "properties": {
          "_id": "binary",
          "_locationType": 1,
          "_returnCode": null,
          "_points": {
            "type": "Array",
            "properties": []
          },
          "_offsets": {
            "type": "Offsets",
            "properties": {
              "_pOffset": posOffset,
              "_pOffRelative": 0,
              "_nOffset": negOffset,
              "_nOffRelative": 0,
              "_version": 3
            }
          }
        }
      };

      for (var i = 0; i < LRPs.length; i++) {
        jsonObj.properties["_points"].properties.push({
          "type": "LocationReferencePoint",
          "properties": {
            "_bearing": LRPs[i].bearing,
            "_distanceToNext": LRPs[i].distanceToNext,
            "_frc": LRPs[i].frc,
            "_fow": LRPs[i].fow,
            "_lfrcnp": LRPs[i].lfrcnp,
            "_isLast": LRPs[i].isLast,
            "_longitude": LRPs[i].lat,
            "_latitude": LRPs[i]["long"],
            "_sequenceNumber": LRPs[i].seqNr
          }
        });
      }

      return jsonObj;
    }
  }]);

  return JsonFormat;
}();

exports["default"] = JsonFormat;