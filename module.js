import Decoder from "./src/utils/Integration/OpenLR/Decoder"
import Encoder from "./src/utils/Integration/OpenLR/Encoder"

import {configProperties,decoderProperties} from "./src/utils/Integration/OpenLR/Coder/CoderSettings"
import Location from "./src/utils/Integration/OpenLR/Coder/Location"
import LocationReferencePoint from "./src/utils/Integration/OpenLR/Coder/LocationReferencePoint"
import LineEncoder from "./src/utils/Integration/OpenLR/Coder/LineEncoder"
import LineDecoder from "./src/utils/Integration/OpenLR/Coder/LineDecoder"
import JsonFormat from "./src/utils/Integration/OpenLR/Coder/JsonFormat"
import RawLineLocationReference from "./src/utils/Integration/OpenLR/Coder/RawLineLocationReference"

import Enum from "./src/utils/Integration/OpenLR/Map/Enum"
import Line from "./src/utils/Integration/OpenLR/Map/Line"
import Node from "./src/utils/Integration/OpenLR/Map/Node"
import MapDataBase from "./src/utils/Integration/OpenLR/Map/MapDataBase"

import {LinesDirectlyToLRPs} from "./src/utils/Integration/OpenLR/experimental/LinesDirectlyToLRPs"

import GeoJsonIntegration from "./src/utils/Integration/OpenLRIntegration/GeoJsonIntegration"
import OSMIntegration from "./src/utils/Integration/OpenLRIntegration/OSMIntegration"
import RoutableTilesIntegration from "./src/utils/Integration/OpenLRIntegration/RoutableTilesIntegration"
import WegenregisterAntwerpenIntegration from "./src/utils/Integration/OpenLRIntegration/WegenregisterAntwerpenIntegration"

import * as tileUtils from "./src/utils/tileUtils"

exports.Decoder = Decoder;
exports.Encoder = Encoder;

exports.configProperties = configProperties;
exports.decoderProperties = decoderProperties;
exports.Location = Location;
exports.LocationReferencePoint = LocationReferencePoint;
exports.LineEncoder = LineEncoder;
exports.LineDecoder = LineDecoder;
exports.JsonFormat = JsonFormat;
exports.RawLineLocationReference = RawLineLocationReference;

exports.Enum = Enum;
exports.Line = Line;
exports.Node = Node;
exports.MapDataBase = MapDataBase;

exports.LinesDirectlyToLRPs = LinesDirectlyToLRPs;

exports.GeoJsonIntegration = GeoJsonIntegration;
exports.OSMIntegration = OSMIntegration;
exports.RoutableTilesIntegration = RoutableTilesIntegration;
exports.WegenregisterAntwerpenIntegration = WegenregisterAntwerpenIntegration;

exports.TileUtils = tileUtils;


