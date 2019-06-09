"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Location = function Location(type, ID) {
  _classCallCheck(this, Location);

  this.type = type;
  this.locationLines = [];
  this.ID = ID; // this.poiLine = {};

  this.posOffset = 0;
  this.negOffset = 0; // this.pointLocation = {};
  // this.accesPoint = {};
  // this.cornerPoints = {};
  // this.lowerLeftPoint = {};
  // this.upperRightPoint = {};
  // this.centerPoint = {};
  // this.radius = {};
  // this.numberOfColumns = 0;
  // this.numberOfRows = 0;
  // this.hasPosOffset = false;
  // this.hasNegOffset = false;
  // this.orientation = {};
  // this.sideOfRoad = {};
};

exports["default"] = Location;