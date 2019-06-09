"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Line = _interopRequireDefault(require("../OpenLR/map/Line"));

var _Node = _interopRequireDefault(require("../OpenLR/map/Node"));

var _WegenregisterAntwerpenFrcWegcatMapping = require("./FRCmappings/WegenregisterAntwerpenFrcWegcatMapping");

var _Enum = require("../OpenLR/map/Enum");

var _WegenregisterAntwerpenFowMorfMapping = require("./FOWmappings/WegenregisterAntwerpenFowMorfMapping");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
This class contains a demo implementation for use of openlr in the wegenregister Antwerpen (geojson).
 */
var WegenregisterAntwerpenIntegration =
/*#__PURE__*/
function () {
  function WegenregisterAntwerpenIntegration() {
    _classCallCheck(this, WegenregisterAntwerpenIntegration);
  }

  _createClass(WegenregisterAntwerpenIntegration, null, [{
    key: "initMapDataBase",
    value: function initMapDataBase(mapDataBase, features) {
      var nodesLines = WegenregisterAntwerpenIntegration.getNodesLines(features);
      mapDataBase.setData(nodesLines.lines, nodesLines.nodes); //todo: set bounding box
    }
  }, {
    key: "getNodesLines",
    value: function getNodesLines(features) {
      var openLRLines = {};
      var openLRNodes = {};

      for (var i = 0; i < features.length; i++) {
        var directionIsUndef = features[i].properties.RIJRICHTING_AUTO === undefined || features[i].properties.RIJRICHTING_AUTO === null; // if(!directionIsUndef){ // skip this if al roads should be added and not only the roads for cars

        if (features[i].geometry.type === "LineString") {
          if (features[i].geometry.coordinates.length >= 2) {
            var lat = features[i].geometry.coordinates[0][1];
            var _long = features[i].geometry.coordinates[0][0];

            if (openLRNodes[lat + "_" + _long] === undefined) {
              openLRNodes[lat + "_" + _long] = new _Node["default"](lat + "_" + _long, lat, _long);
            }

            for (var j = 1; j < features[i].geometry.coordinates.length; j++) {
              lat = features[i].geometry.coordinates[j][1];
              _long = features[i].geometry.coordinates[j][0];

              if (openLRNodes[lat + "_" + _long] === undefined) {
                openLRNodes[lat + "_" + _long] = new _Node["default"](lat + "_" + _long, lat, _long);
              }

              var prevLat = features[i].geometry.coordinates[j - 1][1];
              var prevLong = features[i].geometry.coordinates[j - 1][0];

              if (directionIsUndef || features[i].properties.RIJRICHTING_AUTO === "enkel (mee)" || features[i].properties.RIJRICHTING_AUTO === "dubbel") {
                openLRLines[prevLat + "_" + prevLong + "_" + lat + "_" + _long] = new _Line["default"](prevLat + "_" + prevLong + "_" + lat + "_" + _long, openLRNodes[prevLat + "_" + prevLong], openLRNodes[lat + "_" + _long]);
                openLRLines[prevLat + "_" + prevLong + "_" + lat + "_" + _long].frc = WegenregisterAntwerpenIntegration.getFRC(features[i].properties);
                openLRLines[prevLat + "_" + prevLong + "_" + lat + "_" + _long].fow = WegenregisterAntwerpenIntegration.getFOW(features[i].properties);
              }

              if (directionIsUndef || features[i].properties.RIJRICHTING_AUTO === "enkel (tegen)" || features[i].properties.RIJRICHTING_AUTO === "dubbel") {
                openLRLines[lat + "_" + _long + "_" + prevLat + "_" + prevLong] = new _Line["default"](lat + "_" + _long + "_" + prevLat + "_" + prevLong, openLRNodes[lat + "_" + _long], openLRNodes[prevLat + "_" + prevLong]);
                openLRLines[lat + "_" + _long + "_" + prevLat + "_" + prevLong].frc = WegenregisterAntwerpenIntegration.getFRC(features[i].properties);
                openLRLines[lat + "_" + _long + "_" + prevLat + "_" + prevLong].fow = WegenregisterAntwerpenIntegration.getFOW(features[i].properties);
              }
            }
          }
        } // }

      }

      return {
        nodes: openLRNodes,
        lines: openLRLines
      };
    }
    /***
     * //Depricated Code, only for testing purposes
    static initMapDataBaseDeprecatedNoRoadDirections(mapDataBase,features){
        let nodesLines = WegenregisterAntwerpenIntegration.getNodesLinesDeprecatedNoRoadDirections(features);
        mapDataBase.setData(nodesLines.lines,nodesLines.nodes);
    }
      static getNodesLinesDeprecatedNoRoadDirections(features){
        let openLRLines = {};
        let openLRNodes = {};
        for(let i=0;i<features.length;i++){
              if(features[i].geometry.type === "LineString"){
                if(features[i].geometry.coordinates.length >= 2){
                    let lat = features[i].geometry.coordinates[0][1];
                    let long = features[i].geometry.coordinates[0][0];
                    if(openLRNodes[lat+"_"+long] === undefined){
                        openLRNodes[lat+"_"+long] = new Node(lat+"_"+long,lat,long);
                    }
                    for(let j=1;j<features[i].geometry.coordinates.length;j++){
                        lat = features[i].geometry.coordinates[j][1];
                        long = features[i].geometry.coordinates[j][0];
                        if(openLRNodes[lat+"_"+long] === undefined){
                            openLRNodes[lat+"_"+long] = new Node(lat+"_"+long,lat,long);
                        }
                        let prevLat = features[i].geometry.coordinates[j-1][1];
                        let prevLong = features[i].geometry.coordinates[j-1][0];
                          openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long]
                            = new Line(prevLat+"_"+prevLong+"_"+lat+"_"+long,openLRNodes[prevLat+"_"+prevLong],openLRNodes[lat+"_"+long]);
                        openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long].frc = WegenregisterAntwerpenIntegration.getFRC(features[i].properties);
                        openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long].fow = WegenregisterAntwerpenIntegration.getFOW(features[i].properties);
                          openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong]
                            = new Line(lat+"_"+long+"_"+prevLat+"_"+prevLong,openLRNodes[lat+"_"+long],openLRNodes[prevLat+"_"+prevLong]);
                        openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong].frc = WegenregisterAntwerpenIntegration.getFRC(features[i].properties);
                        openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong].fow = WegenregisterAntwerpenIntegration.getFOW(features[i].properties);
                      }
                }
            }
        }
        return {
            nodes: openLRNodes,
            lines: openLRLines
        }
    }
      static initMapDataBaseDeprecatedAllLineStrings(mapDataBase,features){
        let nodesLines = WegenregisterAntwerpenIntegration.getNodesLinesDeprecatedAllLineStrings(features);
        mapDataBase.setData(nodesLines.lines,nodesLines.nodes);
    }
      static getNodesLinesDeprecatedAllLineStrings(features){
        let openLRLines = {};
        let openLRNodes = {};
        for(let i=0;i<features.length;i++){
              if(features[i].geometry.type === "LineString"){
                if(features[i].geometry.coordinates.length >= 2){
                    let lat = features[i].geometry.coordinates[0][1];
                    let long = features[i].geometry.coordinates[0][0];
                    if(openLRNodes[lat+"_"+long] === undefined){
                        openLRNodes[lat+"_"+long] = new Node(lat+"_"+long,lat,long);
                    }
                    for(let j=1;j<features[i].geometry.coordinates.length;j++){
                        lat = features[i].geometry.coordinates[j][1];
                        long = features[i].geometry.coordinates[j][0];
                        if(openLRNodes[lat+"_"+long] === undefined){
                            openLRNodes[lat+"_"+long] = new Node(lat+"_"+long,lat,long);
                        }
                        let prevLat = features[i].geometry.coordinates[j-1][1];
                        let prevLong = features[i].geometry.coordinates[j-1][0];
                          if(features[i].properties.RIJRICHTING_AUTO === undefined || features[i].properties.RIJRICHTING_AUTO === null || features[i].properties.RIJRICHTING_AUTO === "enkel (mee)" || features[i].properties.RIJRICHTING_AUTO === "dubbel"){
                            openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long]
                                = new Line(prevLat+"_"+prevLong+"_"+lat+"_"+long,openLRNodes[prevLat+"_"+prevLong],openLRNodes[lat+"_"+long]);
                            openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long].frc = WegenregisterAntwerpenIntegration.getFRC(features[i].properties);
                            openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long].fow = WegenregisterAntwerpenIntegration.getFOW(features[i].properties);
                        }
                        if(features[i].properties.RIJRICHTING_AUTO === undefined || features[i].properties.RIJRICHTING_AUTO === null || features[i].properties.RIJRICHTING_AUTO === "enkel (tegen)"  || features[i].properties.RIJRICHTING_AUTO === "dubbel"){
                            openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong]
                                = new Line(lat+"_"+long+"_"+prevLat+"_"+prevLong,openLRNodes[lat+"_"+long],openLRNodes[prevLat+"_"+prevLong]);
                            openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong].frc = WegenregisterAntwerpenIntegration.getFRC(features[i].properties);
                            openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong].fow = WegenregisterAntwerpenIntegration.getFOW(features[i].properties);
                        }
                      }
                }
            }
        }
        return {
            nodes: openLRNodes,
            lines: openLRLines
        }
    }
    */

  }, {
    key: "getFRC",
    value: function getFRC(properties) {
      if (properties !== undefined && properties["WEGCAT"] !== undefined) {
        return _WegenregisterAntwerpenFrcWegcatMapping.WegenregisterAntwerpenFrcWegcatMapping[properties["WEGCAT"]];
      } else {
        return _Enum.frcEnum.FRC_7;
      }
    }
  }, {
    key: "getFOW",
    value: function getFOW(properties) {
      if (properties !== undefined && properties["MORF"] !== undefined) {
        return _WegenregisterAntwerpenFowMorfMapping.WegenregisterAntwerpenFowMorfMapping[properties["MORF"]];
      } else {
        return _Enum.frcEnum.FRC_7;
      }
    }
  }]);

  return WegenregisterAntwerpenIntegration;
}();

exports["default"] = WegenregisterAntwerpenIntegration;