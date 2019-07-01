export { default as OpenLRDecoder } from "./utils/Integration/OpenLR/Decoder"
export { default as OpenLREncoder } from "./utils/Integration/OpenLR/Encoder"

export { configProperties, decoderProperties } from "./utils/Integration/OpenLR/coder/CoderSettings"
export { default as Location } from "./utils/Integration/OpenLR/coder/Location"
export { default as LocationReferencePoint } from "./utils/Integration/OpenLR/coder/LocationReferencePoint"
export { default as LineEncoder } from "./utils/Integration/OpenLR/coder/LineEncoder"
export { default as LineDecoder } from "./utils/Integration/OpenLR/coder/LineDecoder"
export { default as JsonFormat } from "./utils/Integration/OpenLR/coder/JsonFormat"
export { default as RawLineLocationReference } from "./utils/Integration/OpenLR/coder/RawLineLocationReference"

export { locationTypeEnum, fowEnum, frcEnum, internalPrecisionEnum } from "./utils/Integration/OpenLR/map/Enum"
export { default as Line } from "./utils/Integration/OpenLR/map/Line"
export { default as Node } from "./utils/Integration/OpenLR/map/Node"
export { default as MapDataBase } from "./utils/Integration/OpenLR/map/MapDataBase"

export { LinesDirectlyToLRPs } from "./utils/Integration/OpenLR/experimental/LinesDirectlyToLRPs"

export { default as GeoJsonIntegration } from "./utils/Integration/OpenLRIntegration/GeoJsonIntegration"
export { default as OSMIntegration } from "./utils/Integration/OpenLRIntegration/OSMIntegration"
export { default as RoutableTilesIntegration } from "./utils/Integration/OpenLRIntegration/RoutableTilesIntegration"
export { default as WegenregisterAntwerpenIntegration } from "./utils/Integration/OpenLRIntegration/WegenregisterAntwerpenIntegration"

export { getTileXYForLocation, tile2boundingBox } from "./utils/tileUtils"

/*
 * Below currently exported for testing and demoing purposes. Not actually part of the OpenLR implementation.
 * todo: Should be split up into a different package in the future, to to keep the package size low.
 * */
export {
    fetchOsmData,
    fetchRoutableTile,
    loadNodesLineStringsWegenregisterAntwerpen
} from "./utils/Integration/Data/LoadData";

export {
    filterHighwayData,
    getMappedElements, getRoutableTilesNodesAndLines,
    parseToJson
} from "./utils/Integration/Data/ParseData";

export {mapNodesLinesToID} from "./utils/Integration/OpenLR/test/Helperfunctions";
export {map} from "./utils/Integration/Data/testdata/junction_with_lanes_manual";

