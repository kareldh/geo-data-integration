"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OsmFrcHighwayMapping = void 0;

var _Enum = require("../../OpenLR/map/Enum");

//based on https://wiki.openstreetmap.org/wiki/Key:highway
var OsmFrcHighwayMapping = {
  "motorway": _Enum.frcEnum.FRC_0,
  "trunk": _Enum.frcEnum.FRC_1,
  "primary": _Enum.frcEnum.FRC_2,
  "secondary": _Enum.frcEnum.FRC_3,
  "tertiary": _Enum.frcEnum.FRC_4,
  "unclassified": _Enum.frcEnum.FRC_6,
  "residential": _Enum.frcEnum.FRC_5,
  "motorway_link": _Enum.frcEnum.FRC_0,
  "trunk_link": _Enum.frcEnum.FRC_1,
  "primary_link": _Enum.frcEnum.FRC_2,
  "secondary_link": _Enum.frcEnum.FRC_3,
  "tertiary_link": _Enum.frcEnum.FRC_4
};
exports.OsmFrcHighwayMapping = OsmFrcHighwayMapping;