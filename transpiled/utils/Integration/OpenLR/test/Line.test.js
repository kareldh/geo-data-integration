"use strict";

var _Node = _interopRequireDefault(require("../map/Node"));

var _Line = _interopRequireDefault(require("../map/Line"));

var _helpers = require("@turf/helpers");

var _bearing = _interopRequireDefault(require("@turf/bearing"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

test('creating line adds it to node incoming or outgoing lines', function () {
  var nodeA = new _Node["default"](1, -8, -3);
  var nodeB = new _Node["default"](2, -6, 5);
  var line1 = new _Line["default"](1, nodeA, nodeB);
  var line14 = new _Line["default"](14, nodeB, nodeA);
  expect(nodeA.getIncomingLines().length).toEqual(1);
  expect(nodeA.getOutgoingLines().length).toEqual(1);
  expect(nodeB.getIncomingLines().length).toEqual(1);
  expect(nodeB.getOutgoingLines().length).toEqual(1);
  expect(nodeA.getIncomingLines()[0]).toBe(line14);
  expect(nodeA.getOutgoingLines()[0]).toBe(line1);
  expect(nodeB.getIncomingLines()[0]).toBe(line1);
  expect(nodeB.getOutgoingLines()[0]).toBe(line14);
});

function radians(n) {
  return n * (Math.PI / 180);
}

function degrees(n) {
  return n * (180 / Math.PI);
}

function getBearing2(startLat, startLong, endLat, endLong) {
  startLat = radians(startLat);
  startLong = radians(startLong);
  endLat = radians(endLat);
  endLong = radians(endLong);
  var dLong = endLong - startLong;
  var dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));

  if (Math.abs(dLong) > Math.PI) {
    if (dLong > 0.0) dLong = -(2.0 * Math.PI - dLong);else dLong = 2.0 * Math.PI + dLong;
  }

  return (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
}

function getBearing3(startLat, startLong, endLat, endLong) {
  var lat1 = radians(startLat);
  var lon1 = radians(startLong);
  var lat2 = radians(endLat);
  var lon2 = radians(endLong);
  var a = Math.sin(lon2 - lon1) * Math.cos(lat2);
  var b = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  console.warn(lat1, lon1, lat2, lon2);
  console.warn(a, b);
  return (degrees(Math.atan2(a, b)) + 360.0) % 360.0;
}

test('bearing calculation', function () {
  var startLat = 43.682213;
  var startLong = -70.450696;
  var startLat2 = 43.682194;
  var startLong2 = -70.450769;
  var p1 = (0, _helpers.point)([startLong, startLat]);
  var p2 = (0, _helpers.point)([startLong2, startLat2]);
  console.log(((0, _bearing["default"])(p1, p2) + 360.0) % 360.0);
  console.log(getBearing2(startLat, startLong, startLat2, startLong2));
  console.log(getBearing3(startLat, startLong, startLat2, startLong2));
});