"use strict";

var _Node = _interopRequireDefault(require("../map/Node"));

var _Line = _interopRequireDefault(require("../map/Line"));

var _Dijkstra = _interopRequireDefault(require("../coder/Dijkstra"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

test('ShortestPath', function () {
  var nodeA = new _Node["default"](1, -8, -3);
  var nodeB = new _Node["default"](2, -6, 5);
  var nodeC = new _Node["default"](3, -3, 3);
  var nodeD = new _Node["default"](4, -1, 1);
  var nodeE = new _Node["default"](5, -1, -2);
  var nodeF = new _Node["default"](6, 0, 5);
  var nodeG = new _Node["default"](7, 3, 5);
  var nodeH = new _Node["default"](8, 3, 2);
  var nodeI = new _Node["default"](9, 7, 5);
  var nodeJ = new _Node["default"](10, 7, -1);
  var line1 = new _Line["default"](1, nodeA, nodeB);
  var line14 = new _Line["default"](14, nodeB, nodeA);
  var line2 = new _Line["default"](2, nodeB, nodeF);
  var line15 = new _Line["default"](15, nodeF, nodeB);
  var line3 = new _Line["default"](3, nodeF, nodeG);
  var line16 = new _Line["default"](16, nodeG, nodeF);
  var line4 = new _Line["default"](4, nodeG, nodeI);
  var line17 = new _Line["default"](17, nodeI, nodeG);
  var line5 = new _Line["default"](5, nodeC, nodeF);
  var line18 = new _Line["default"](18, nodeF, nodeC);
  var line6 = new _Line["default"](6, nodeD, nodeG);
  var line19 = new _Line["default"](19, nodeG, nodeD);
  var line7 = new _Line["default"](7, nodeH, nodeG);
  var line20 = new _Line["default"](20, nodeG, nodeH);
  var line8 = new _Line["default"](8, nodeH, nodeI);
  var line21 = new _Line["default"](21, nodeI, nodeH);
  var line9 = new _Line["default"](9, nodeI, nodeJ);
  var line22 = new _Line["default"](22, nodeJ, nodeI);
  var line10 = new _Line["default"](10, nodeC, nodeD);
  var line23 = new _Line["default"](23, nodeD, nodeC);
  var line11 = new _Line["default"](11, nodeD, nodeH);
  var line24 = new _Line["default"](24, nodeH, nodeD);
  var line12 = new _Line["default"](12, nodeE, nodeH);
  var line25 = new _Line["default"](25, nodeH, nodeE);
  var line13 = new _Line["default"](13, nodeH, nodeJ);
  var line26 = new _Line["default"](26, nodeJ, nodeH);

  var shortestPath = _Dijkstra["default"].shortestPath(nodeC, nodeI);

  expect(shortestPath.lines[0].getID()).toEqual(line5.getID());
  expect(shortestPath.lines[1].getID()).toEqual(line3.getID());
  expect(shortestPath.lines[2].getID()).toEqual(line4.getID());

  var shortestPath2 = _Dijkstra["default"].shortestPath(nodeA, nodeJ);

  expect(shortestPath2.lines[0].getID()).toEqual(line1.getID());
  expect(shortestPath2.lines[1].getID()).toEqual(line2.getID());
  expect(shortestPath2.lines[2].getID()).toEqual(line3.getID());
  expect(shortestPath2.lines[3].getID()).toEqual(line20.getID());
  expect(shortestPath2.lines[4].getID()).toEqual(line13.getID());

  var shortestPath3 = _Dijkstra["default"].shortestPath(nodeA, nodeA);

  expect(shortestPath3).toEqual({
    lines: [],
    length: 0
  });
});