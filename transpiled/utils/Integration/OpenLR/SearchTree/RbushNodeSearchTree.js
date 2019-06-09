"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _rbush = _interopRequireDefault(require("rbush"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
Deprecated, use GeoJSONRbusNodeSearchTree instead
 */
var RbushNodeSearchTree =
/*#__PURE__*/
function () {
  function RbushNodeSearchTree(nodes) {
    _classCallCheck(this, RbushNodeSearchTree);

    this.tree = (0, _rbush["default"])(9, ['[0]', '[1]', '[0]', '[1]']);
    this.addNodes(nodes);
  } // one node === Node object


  _createClass(RbushNodeSearchTree, [{
    key: "addNodes",
    value: function addNodes(nodes) {
      var data = []; //todo: this could already be made in the openlr integration classes

      for (var id in nodes) {
        if (nodes.hasOwnProperty(id)) {
          if (isNaN(nodes[id].getLongitudeDeg()) || isNaN(nodes[id].getLatitudeDeg())) {
            throw nodes[id];
          }

          data.push([nodes[id].getLongitudeDeg(), nodes[id].getLatitudeDeg(), nodes[id].getID()]);
        }
      }

      this.tree.load(data);
    } // one node === [long, lat, id]

  }, {
    key: "addData",
    value: function addData(data) {
      this.tree.load(data);
    } //todo: remove nodes
    //dist given in meters
    //uses an approximate square bounding box around the given point, so it is possible that nodes are returned that
    //are further than dist away. It is still necessary to iterate the returned nodes and calculate their real distance.

  }, {
    key: "findCloseBy",
    value: function findCloseBy(lat, _long, dist) {
      var earthRadius = 6371000;
      var latDiff = this.toDegrees(dist / earthRadius);
      var longDiff = this.toDegrees(dist / (Math.cos(this.toRadians(lat)) * earthRadius));
      var foundNodes = [];
      var latUpper = lat + latDiff;
      var latLower = lat - latDiff;
      var longUpper = _long + longDiff;
      var longLower = _long - longDiff;
      var latOverflow = latUpper > 90;
      var latUnderflow = latLower < -90;
      var longOverflow = longUpper > 180;
      var longUnderflow = longLower < -180;

      if (latOverflow && latUnderflow || longOverflow || longUnderflow) {
        console.error("Given distance is to long and would cover all nodes. All nodes are returned.");
        return this.tree.all();
      }

      if (!latOverflow && !latUnderflow && !longOverflow && !longUnderflow) {
        Array.prototype.push.apply(foundNodes, this.tree.search({
          minX: longLower,
          minY: latLower,
          maxX: longUpper,
          maxY: latUpper
        }));
      } else {
        var bottomLatMin;
        var bottomLatMax;
        var topLatMin;
        var topLatMax;
        var leftLongMin;
        var leftLongMax;
        var rightLongMin;
        var rightLongMax;

        if (latOverflow) {
          bottomLatMin = latLower;
          bottomLatMax = 90;
          topLatMin = -90;
          topLatMax = -90 + (latUpper - 90);
        }

        if (longOverflow) {
          leftLongMin = longLower;
          leftLongMax = 180;
          rightLongMin = -180;
          rightLongMax = -180 + (longUpper - 180);
        }

        if (latUnderflow) {
          bottomLatMin = 90 + (latLower + 90);
          bottomLatMax = 90;
          topLatMin = -90;
          topLatMax = latUpper;
        }

        if (longUnderflow) {
          leftLongMin = 90 + (latLower + 90);
          leftLongMax = 180;
          rightLongMin = -180;
          rightLongMax = longUpper;
        }

        if (latOverflow && (longUnderflow || longOverflow) || latUnderflow && (longUnderflow || longOverflow)) {
          Array.prototype.push.apply(foundNodes, this.tree.search({
            minX: leftLongMin,
            minY: bottomLatMin,
            maxX: leftLongMax,
            maxY: bottomLatMax
          }));
          Array.prototype.push.apply(foundNodes, this.tree.search({
            minX: rightLongMin,
            minY: bottomLatMin,
            maxX: rightLongMax,
            maxY: bottomLatMax
          }));
          Array.prototype.push.apply(foundNodes, this.tree.search({
            minX: rightLongMin,
            minY: topLatMin,
            maxX: rightLongMax,
            maxY: topLatMax
          }));
          Array.prototype.push.apply(foundNodes, this.tree.search({
            minX: leftLongMin,
            minY: topLatMin,
            maxX: leftLongMax,
            maxY: topLatMax
          }));
        } else if (latOverflow || latUnderflow) {
          Array.prototype.push.apply(foundNodes, this.tree.search({
            minX: longLower,
            minY: bottomLatMin,
            maxX: longUpper,
            maxY: bottomLatMax
          }));
          Array.prototype.push.apply(foundNodes, this.tree.search({
            minX: longLower,
            minY: topLatMin,
            maxX: longUpper,
            maxY: topLatMax
          }));
        } else if (longOverflow || longUnderflow) {
          Array.prototype.push.apply(foundNodes, this.tree.search({
            minX: rightLongMin,
            minY: latLower,
            maxX: rightLongMax,
            maxY: latUpper
          }));
          Array.prototype.push.apply(foundNodes, this.tree.search({
            minX: leftLongMin,
            minY: latLower,
            maxX: leftLongMax,
            maxY: latUpper
          }));
        }
      } // if the same return values as GeoJSONRbushNodeSearchTree are needed, use:


      return foundNodes.map(function (node) {
        return {
          "properties": {
            id: node[2]
          },
          "geometry": {
            "type": "Point",
            coordinates: [node[0], node[1]]
          }
        };
      }); // but that will add an extra iteration over the return values
      // return foundNodes;
    }
  }, {
    key: "toRadians",
    value: function toRadians(degrees) {
      return degrees * Math.PI / 180;
    }
  }, {
    key: "toDegrees",
    value: function toDegrees(radians) {
      return radians / Math.PI * 180;
    }
  }]);

  return RbushNodeSearchTree;
}();

exports["default"] = RbushNodeSearchTree;