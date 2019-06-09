"use strict";

var _Helperfunctions = require("../../test/Helperfunctions");

var _RbushNodeSearchTree = _interopRequireDefault(require("../RbushNodeSearchTree"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

test('RbushNodeSearchTree constructor', function () {
  var network = (0, _Helperfunctions.generateRealisticLengthTestNetwork)();
  var data = (0, _Helperfunctions.mapNodesLinesToID)(network.nodes, network.lines);
  var searchTree = new _RbushNodeSearchTree["default"](data.nodes);
  expect(searchTree).toBeDefined(); // console.log(network.lines[7].getLength(),network.lines[8].getLength(),network.lines[13].getLength(),network.lines[11].getLength(),network.lines[12].getLength(),network.nodes[6].getDistance(network.nodes[8].getLatitudeDeg(),network.nodes[8].getLongitudeDeg()));

  var searchResult = searchTree.findCloseBy(3 * 0.001 + 51, 2 * 0.001 + 4, 493);
  console.log(searchResult);
  expect(searchResult.length).toEqual(7);
});