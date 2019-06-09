"use strict";

var _Helperfunctions = require("../../test/Helperfunctions");

var _GeoJSONRbushLineSearchTree = _interopRequireDefault(require("../GeoJSONRbushLineSearchTree"));

var _RbushLineSearchTree = _interopRequireDefault(require("../RbushLineSearchTree"));

var _RbushNodeSearchTree = _interopRequireDefault(require("../RbushNodeSearchTree"));

var _GeoJSONRbushNodeSearchTree = _interopRequireDefault(require("../GeoJSONRbushNodeSearchTree"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

test('GeoJSONRbushLineSearchTree vs RbusLineSearchTree', function () {
  var network = (0, _Helperfunctions.generateRealisticLengthTestNetwork)();
  var data = (0, _Helperfunctions.mapNodesLinesToID)(network.nodes, network.lines);
  var t1 = performance.now();
  var searchTree = new _RbushLineSearchTree["default"](data.lines);
  var searchResult = searchTree.findCloseBy(3 * 0.001 + 51, 2 * 0.001 + 4, 493);
  var t2 = performance.now();
  console.log("found in", t2 - t1, "ms using RbushLineSearchTree");
  var t3 = performance.now();
  var searchTree2 = new _GeoJSONRbushLineSearchTree["default"](data.lines);
  var searchResult2 = searchTree2.findCloseBy(3 * 0.001 + 51, 2 * 0.001 + 4, 493);
  var t4 = performance.now();
  console.log("found in", t4 - t3, "ms using GeoJSONRbushLineSearchTree");
  expect(searchResult.length).toEqual(24);
  expect(searchResult2.length).toEqual(24);
});
test('GeoJSONRbushNodeSearchTree vs RbushNodeSearchTree', function () {
  var network = (0, _Helperfunctions.generateRealisticLengthTestNetwork)();
  var data = (0, _Helperfunctions.mapNodesLinesToID)(network.nodes, network.lines);
  var t1 = performance.now();
  var searchTree = new _RbushNodeSearchTree["default"](data.nodes);
  var searchResult = searchTree.findCloseBy(3 * 0.001 + 51, 2 * 0.001 + 4, 493);
  var t2 = performance.now();
  console.log("found in", t2 - t1, "ms using RbushNodeSearchTree");
  var t3 = performance.now();
  var searchTree2 = new _GeoJSONRbushNodeSearchTree["default"](data.nodes);
  var searchResult2 = searchTree2.findCloseBy(3 * 0.001 + 51, 2 * 0.001 + 4, 493);
  var t4 = performance.now();
  console.log("found in", t4 - t3, "ms using GeoJSONRbushNodeSearchTree");
  expect(searchResult.length).toEqual(7);
  expect(searchResult2.length).toEqual(7);
});