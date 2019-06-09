"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _LocationReferencePoint = _interopRequireDefault(require("./LocationReferencePoint"));

var _Enum = require("../map/Enum");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import {configProperties} from "./CoderSettings";
var LRPNodeHelper =
/*#__PURE__*/
function () {
  function LRPNodeHelper() {
    _classCallCheck(this, LRPNodeHelper);
  }

  _createClass(LRPNodeHelper, null, [{
    key: "lrpLinesToLRPs",
    value: function lrpLinesToLRPs(lrpLines, shortestPaths) {
      if (lrpLines.length < 2) {
        throw Error("not enough LRP lines");
      }

      var LRPs = [];

      for (var i = 0; i < lrpLines.length; i++) {
        var properties = {};
        var isLast = false;
        var frc = lrpLines[i].getFRC();
        var fow = lrpLines[i].getFOW();
        var lat = void 0;

        var _long = void 0;

        var distanceToNext = void 0;
        var bearing = void 0;
        var lfrcnp = void 0;

        if (i < lrpLines.length - 1) {
          properties = this.calcProperties(shortestPaths[i].lines, lrpLines[i + 1].getStartNode());
          lat = lrpLines[i].getStartNode().getLatitudeDeg();
          _long = lrpLines[i].getStartNode().getLongitudeDeg();
          bearing = lrpLines[i].getBearing();
          lfrcnp = properties.lfrcnp;
          distanceToNext = lrpLines[i].getLength() + properties.pathLength;

          if (i === lrpLines.length - 2 && lrpLines[lrpLines.length - 2].getID() !== lrpLines[lrpLines.length - 1].getID()) {
            distanceToNext += lrpLines[lrpLines.length - 1].getLength();
          }
        } else {
          isLast = true;
          lat = lrpLines[i].getEndNode().getLatitudeDeg();
          _long = lrpLines[i].getEndNode().getLongitudeDeg();
          bearing = lrpLines[i].getReverseBearing();
          lfrcnp = _Enum.frcEnum.FRC_7;
          distanceToNext = 0;
        }

        var LRP = new _LocationReferencePoint["default"](bearing, distanceToNext, frc, fow, lfrcnp, isLast, lat, _long, i + 1);
        LRPs.push(LRP);
      }

      return LRPs;
    }
  }, {
    key: "calcProperties",
    value: function calcProperties(shortestPath, nextNode) {
      var i = 0;
      var pathLength = 0;
      var leastFRCtillNextPoint = _Enum.frcEnum.FRC_0;
      var frcIsDefined = false;

      while (i < shortestPath.length && shortestPath[i].getStartNode() !== nextNode) {
        pathLength += shortestPath[i].getLength();

        if (shortestPath[i].getFRC() !== undefined && shortestPath[i].getFRC() > leastFRCtillNextPoint) {
          leastFRCtillNextPoint = shortestPath[i].getFRC();
          frcIsDefined = true;
        }

        i++;
      }

      return {
        pathLength: pathLength,
        lfrcnp: frcIsDefined ? leastFRCtillNextPoint : _Enum.frcEnum.FRC_7
      };
    }
    /*
    " The bearing (BEAR) describes the angle between the true North and a line which is defined by the
    coordinate of the LR-point and a coordinate which is BEARDIST along the line defined by the LR-point attributes.
    If the line length is less than BEARDIST then the opposite point of the line is used
    (regardless of BEARDIST). The bearing is measured in degrees and always positive (measuring
    clockwise from North). "
    <- http://www.openlr.org/data/docs/OpenLR-Whitepaper_v1.5.pdf
     */
    // static calcProperties(beardist,node,shortestPath,nextNode){
    //     //find the position beardist meters on the path, unless the next LRP is closer than 20 meters
    //     let i = 0;
    //     let pathLength = 0;
    //     let calcBear = undefined;
    //     let leastFRCtillNextPoint = frcEnum.FRC_7;
    //     while(i < shortestPath.length && shortestPath[i].getStartNode() !== nextNode){
    //         if(calcBear === undefined && pathLength+shortestPath[i].getLength() > 20){
    //             // the bearingdist point lays on this line
    //             let distanceFromLRP = beardist - pathLength;
    //             let bearDistLoc = shortestPath[i].getGeoCoordinateAlongLine(distanceFromLRP);
    //             let lrpPoint = point([node.getLatitudeDeg(), node.getLongitudeDeg()]);
    //             let bearDistPoint = point([bearDistLoc.lat,bearDistLoc.long]);
    //
    //             calcBear = bearing(lrpPoint, bearDistPoint);
    //             if(calcBear < 0){
    //                 // bear is always positive, counterclockwise
    //                 calcBear += 360;
    //             }
    //         }
    //         pathLength += shortestPath[i].getLength();
    //         if(shortestPath[i].getFRC() !== undefined && shortestPath[i].getFRC() < leastFRCtillNextPoint){
    //             leastFRCtillNextPoint = shortestPath[i].getFRC();
    //         }
    //         i++;
    //     }
    //     if(calcBear === undefined){
    //         //means that the next LRP lays earlier than the beardist point
    //         let lrpPoint = point([node.getLatitudeDeg(), node.getLongitudeDeg()]);
    //         let nextLrpPoint = point([nextNode.getLatitudeDeg(), nextNode.getLongitudeDeg()]);
    //
    //         calcBear = bearing(lrpPoint, nextLrpPoint);
    //         if(calcBear < 0){
    //             // bear is always positive, counterclockwise
    //             calcBear += 360;
    //         }
    //     }
    //     return {
    //         bearing: calcBear,
    //         pathLength: pathLength,
    //         lfrcnp: leastFRCtillNextPoint
    //     }
    // }
    //
    // static calcLastLRPProperties(beardist,prevNode,shortestPath,lastNode){
    //     //find the position beardist meters away from the end of the path, unless the previous LRP is closer than 20 meters
    //     let i = 0;
    //     let calcBear = undefined;
    //     let leastFRCtillNextPoint = frcEnum.FRC_0;
    //     while(i < shortestPath.length && shortestPath[i].getStartNode() !== lastNode){
    //         if(shortestPath[i].getFRC() !== undefined && shortestPath[i].getFRC() < leastFRCtillNextPoint){
    //             leastFRCtillNextPoint = shortestPath[i].getFRC();
    //         }
    //         i++;
    //     }
    //     i--;
    //     let reverseLength = 0;
    //     while(i > 0 && calcBear === undefined){
    //         if(reverseLength+shortestPath[i].getLength() > beardist){
    //             // the bearingdist point lays on this line
    //             let distance = reverseLength+shortestPath[i].getLength()-beardist;
    //             let bearDistLoc = shortestPath[i].getGeoCoordinateAlongLine(distance);
    //             let lrpPoint = point([lastNode.getLatitudeDeg(), lastNode.getLongitudeDeg()]);
    //             let bearDistPoint = point([bearDistLoc.lat,bearDistLoc.long]);
    //
    //             calcBear = bearing(lrpPoint, bearDistPoint);
    //             if(calcBear < 0){
    //                 // bear is always positive, counterclockwise
    //                 calcBear += 360;
    //             }
    //         }
    //         i--;
    //     }
    //     if(calcBear === undefined){
    //         //means that the previous LRP lays further than the beardist point
    //         let lrpPoint = point([lastNode.getLatitudeDeg(), lastNode.getLongitudeDeg()]);
    //         let prevLrpPoint = point([prevNode.getLatitudeDeg(), prevNode.getLongitudeDeg()]);
    //
    //         calcBear = bearing(lrpPoint, prevLrpPoint);
    //         if(calcBear < 0){
    //             // bear is always positive, counterclockwise
    //             calcBear += 360;
    //         }
    //     }
    //
    //     return {
    //         bearing: calcBear,
    //         pathLength: 0,
    //         lfrcnp: leastFRCtillNextPoint
    //     }
    // }

  }]);

  return LRPNodeHelper;
}();

exports["default"] = LRPNodeHelper;