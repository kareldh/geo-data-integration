"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RawLineLocationReference = function RawLineLocationReference(LRPs, posOffset, negOffset) {
  _classCallCheck(this, RawLineLocationReference);

  this.type = "RawLineLocationReference";
  this.properties = {
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
  };

  for (var i = 0; i < LRPs.length; i++) {
    this.properties["_points"].properties.push({
      "type": "LocationReferencePoint",
      "properties": {
        "_bearing": LRPs[i].bearing,
        "_distanceToNext": LRPs[i].distanceToNext,
        "_frc": LRPs[i].frc,
        "_fow": LRPs[i].fow,
        "_lfrcnp": LRPs[i].lfrcnp,
        "_isLast": LRPs[i].isLast,
        "_longitude": LRPs[i].lat,
        "_latitude": LRPs[i].lon,
        "_sequenceNumber": LRPs[i].seqNr
      }
    });
  }
};

exports["default"] = RawLineLocationReference;