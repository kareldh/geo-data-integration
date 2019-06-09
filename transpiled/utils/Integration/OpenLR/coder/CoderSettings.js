"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configProperties = exports.decoderProperties = void 0;

var _Enum = require("../map/Enum");

var decoderProperties = {
  dist: 5,
  //maximum distance (in meter) of a candidate node to a LRP
  bearDiff: 60,
  //maximum difference (in degrees) between the bearing of a candidate node and that of a LRP
  frcDiff: 3,
  //maximum difference between the FRC of a candidate node and that of a LRP
  lfrcnpDiff: 3,
  //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
  distanceToNextDiff: 40,
  //maximum difference (in meter) between the found distance between 2 LRPs and the given distanceToNext of the first LRP
  alwaysUseProjections: false,
  useFrcFow: true,
  distMultiplier: 40,
  frcMultiplier: 35,
  fowMultiplier: 40,
  bearMultiplier: 30,
  maxSPSearchRetries: 200,
  maxDecodeRetries: 2,
  distMultiplierForRetry: 2
};
exports.decoderProperties = decoderProperties;
var configProperties = {
  bearDist: 20,
  // in meter!!
  internalPrecision: _Enum.internalPrecisionEnum.CENTIMETER
};
exports.configProperties = configProperties;