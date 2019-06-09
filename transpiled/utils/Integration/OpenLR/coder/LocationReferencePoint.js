"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _CoderSettings = require("./CoderSettings");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocationReferencePoint = function LocationReferencePoint(bearing, distanceToNext, frc, fow, lfrcnp, islast, lat, lon, seqNr) {
  _classCallCheck(this, LocationReferencePoint);

  this.bearing = Math.round(bearing);
  this.distanceToNext = Math.round(distanceToNext / _CoderSettings.configProperties.internalPrecision);
  this.frc = frc;
  this.fow = fow;
  this.lfrcnp = lfrcnp;
  this.isLast = islast;
  this.lat = Number(Math.round(lat + 'e5') + 'e-5');
  this["long"] = Number(Math.round(lon + 'e5') + 'e-5');
  this.seqNr = seqNr;
};

exports["default"] = LocationReferencePoint;