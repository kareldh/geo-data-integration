"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OsmFowHighwayMapping = void 0;

var _Enum = require("../../OpenLR/map/Enum");

//based on https://wiki.openstreetmap.org/wiki/Key:highway
//and https://wiki.openstreetmap.org/wiki/NL:The_Netherlands_roads_tagging
var OsmFowHighwayMapping = {
  "motorway": _Enum.fowEnum.MULTIPLE_CARRIAGEWAY,
  "trunk": _Enum.fowEnum.MOTORWAY,
  "primary": _Enum.fowEnum.SINGLE_CARRIAGEWAY,
  "secondary": _Enum.fowEnum.SINGLE_CARRIAGEWAY,
  "tertiary": _Enum.fowEnum.SINGLE_CARRIAGEWAY,
  "unclassified": _Enum.fowEnum.SINGLE_CARRIAGEWAY,
  "residential": _Enum.fowEnum.SINGLE_CARRIAGEWAY,
  "motorway_link": _Enum.fowEnum.SLIPROAD,
  "trunk_link": _Enum.fowEnum.SLIPROAD,
  "primary_link": _Enum.fowEnum.SLIPROAD,
  "secondary_link": _Enum.fowEnum.SLIPROAD,
  "tertiary_link": _Enum.fowEnum.SLIPROAD,
  "living_street": _Enum.fowEnum.OTHER,
  "service": _Enum.fowEnum.OTHER,
  "pedestrian": _Enum.fowEnum.OTHER,
  "track": _Enum.fowEnum.OTHER,
  "bus_guideway": _Enum.fowEnum.OTHER,
  "excape": _Enum.fowEnum.OTHER,
  "road": _Enum.fowEnum.OTHER,
  "footway": _Enum.fowEnum.OTHER,
  "bridleway": _Enum.fowEnum.OTHER,
  "steps": _Enum.fowEnum.OTHER,
  "path": _Enum.fowEnum.OTHER,
  "cycleway": _Enum.fowEnum.OTHER,
  "proposed": _Enum.fowEnum.OTHER,
  "construction": _Enum.fowEnum.OTHER,
  "bus_stop": _Enum.fowEnum.OTHER,
  "crossing": _Enum.fowEnum.OTHER,
  "elevator": _Enum.fowEnum.OTHER,
  "emergency_access_point": _Enum.fowEnum.OTHER,
  "give_way": _Enum.fowEnum.OTHER,
  "mini_roundabout": _Enum.fowEnum.ROUNDABOUT,
  "motorway_junction": _Enum.fowEnum.SINGLE_CARRIAGEWAY,
  "passing_place": _Enum.fowEnum.OTHER,
  "rest_area": _Enum.fowEnum.OTHER,
  "speed_camera": _Enum.fowEnum.OTHER,
  "street_lamp": _Enum.fowEnum.OTHER,
  "services": _Enum.fowEnum.OTHER,
  "stop": _Enum.fowEnum.OTHER,
  "traffic_signals": _Enum.fowEnum.OTHER,
  "turning_circle": _Enum.fowEnum.OTHER
};
exports.OsmFowHighwayMapping = OsmFowHighwayMapping;