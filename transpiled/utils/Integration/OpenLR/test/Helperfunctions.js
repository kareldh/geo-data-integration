"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateStraightLaneTestData = generateStraightLaneTestData;
exports.mapNodesLinesToID = mapNodesLinesToID;
exports.generateTestNetwork = generateTestNetwork;
exports.generateRealisticLengthTestNetwork = generateRealisticLengthTestNetwork;
exports.loadRTtestNetworkWithLoop = loadRTtestNetworkWithLoop;

var _Node = _interopRequireDefault(require("../map/Node"));

var _Location = _interopRequireDefault(require("../coder/Location"));

var _Line = _interopRequireDefault(require("../map/Line"));

var _Enum = require("../map/Enum");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function generateStraightLaneTestData() {
  var lines = [];
  var nodes = [];
  var node1 = new _Node["default"](1, 51.2120579, 4.3974671);
  var node2 = new _Node["default"](2, 51.2118214, 4.3991321);
  var node3 = new _Node["default"](3, 51.2120361, 4.3974671);
  var node4 = new _Node["default"](4, 51.2120058, 4.3976971);
  var node5 = new _Node["default"](5, 51.2120184, 4.3977501); //todo: line parameters (length, frc, ...)

  var line1 = new _Line["default"](1, node1, node2);
  var line2 = new _Line["default"](2, node3, node4);
  var line3 = new _Line["default"](3, node4, node5);
  node1.setLines([], [line1]);
  node2.setLines([line1], []);
  node3.setLines([], [line2]);
  node4.setLines([line2], [line3]);
  node5.setLines([line3], []);
  nodes.push(node1, node2, node3, node4, node5);
  lines.push(line1, line2, line3);
  var singleLineLane = new _Location["default"](_Enum.locationTypeEnum.LINE_LOCATION, 1);
  singleLineLane.locationLines = [line1];
  var doubleLineLane = new _Location["default"](_Enum.locationTypeEnum.LINE_LOCATION, 2);
  doubleLineLane.locationLines = [line2, line3];
  var unconnectedLane = new _Location["default"](_Enum.locationTypeEnum.LINE_LOCATION, 3);
  unconnectedLane.locationLines = [line1, line3];
  var invalidStartNodeLane = new _Location["default"](_Enum.locationTypeEnum.LINE_LOCATION, 4);
  invalidStartNodeLane.locationLines = [line3];
  var invalidEndNodeLane = new _Location["default"](_Enum.locationTypeEnum.LINE_LOCATION, 5);
  invalidEndNodeLane.locationLines = [line2];
  return {
    lines: lines,
    nodes: nodes,
    singleLineLane: singleLineLane,
    doubleLineLane: doubleLineLane,
    unconnectedLane: unconnectedLane,
    invalidStartNodeLane: invalidStartNodeLane,
    invalidEndNodeLane: invalidEndNodeLane
  };
}

function mapNodesLinesToID(nodes, lines) {
  var mappedNodes = {};
  var mappedLines = {};
  nodes.forEach(function (node) {
    if (node !== undefined) mappedNodes[node.getID()] = node;
  });
  lines.forEach(function (line) {
    if (line !== undefined) mappedLines[line.getID()] = line;
  });
  return {
    nodes: mappedNodes,
    lines: mappedLines
  };
}

function generateTestNetwork() {
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
  return {
    nodes: [nodeA, nodeB, nodeC, nodeD, nodeE, nodeF, nodeG, nodeH, nodeI, nodeJ],
    lines: [undefined, line1, line2, line3, line4, line5, line6, line7, line8, line9, line10, line11, line12, line13, line14, line15, line16, line17, line18, line19, line20, line21, line22, line23, line24, line25, line26]
  };
}

function generateRealisticLengthTestNetwork() {
  var nodeA = new _Node["default"](1, -8 * 0.001 + 51, -3 * 0.001 + 4);
  var nodeB = new _Node["default"](2, -6 * 0.001 + 51, 5 * 0.001 + 4);
  var nodeC = new _Node["default"](3, -3 * 0.001 + 51, 3 * 0.001 + 4);
  var nodeD = new _Node["default"](4, -1 * 0.001 + 51, 1 * 0.001 + 4);
  var nodeE = new _Node["default"](5, -1 * 0.001 + 51, -2 * 0.001 + 4);
  var nodeF = new _Node["default"](6, 0 * 0.001 + 51, 5 * 0.001 + 4);
  var nodeG = new _Node["default"](7, 3 * 0.001 + 51, 5 * 0.001 + 4);
  var nodeH = new _Node["default"](8, 3 * 0.001 + 51, 2 * 0.001 + 4);
  var nodeI = new _Node["default"](9, 7 * 0.001 + 51, 5 * 0.001 + 4);
  var nodeJ = new _Node["default"](10, 7 * 0.001 + 51, -1 * 0.001 + 4);
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
  return {
    nodes: [nodeA, nodeB, nodeC, nodeD, nodeE, nodeF, nodeG, nodeH, nodeI, nodeJ],
    lines: [undefined, line1, line2, line3, line4, line5, line6, line7, line8, line9, line10, line11, line12, line13, line14, line15, line16, line17, line18, line19, line20, line21, line22, line23, line24, line25, line26]
  };
}

function loadRTtestNetworkWithLoop() {
  var n1 = new _Node["default"]("http://www.openstreetmap.org/node/4691959557", 51.2126651, 4.4066541);
  var n2 = new _Node["default"]("http://www.openstreetmap.org/node/5607822120", 51.2126422, 4.4066453);
  var n3 = new _Node["default"]("http://www.openstreetmap.org/node/5607832955", 51.2126153, 4.4067580);
  var n4 = new _Node["default"]("http://www.openstreetmap.org/node/5607832954", 51.2125941, 4.4068391);
  var n5 = new _Node["default"]("http://www.openstreetmap.org/node/5607832950", 51.2125183, 4.4070575);
  var n6 = new _Node["default"]("http://www.openstreetmap.org/node/5607832953", 51.2124908, 4.4071645);
  var n7 = new _Node["default"]("http://www.openstreetmap.org/node/5607822421", 51.2124336, 4.4074395);
  var n8 = new _Node["default"]("http://www.openstreetmap.org/node/5607822443", 51.2124724, 4.4074550);
  var n9 = new _Node["default"]("http://www.openstreetmap.org/node/5607832951", 51.2125418, 4.4073929);
  var n10 = new _Node["default"]("http://www.openstreetmap.org/node/5607822427", 51.2126749, 4.4073613);
  var n11 = new _Node["default"]("http://www.openstreetmap.org/node/5607822435", 51.2128848, 4.4073296);
  var n12 = new _Node["default"]("http://www.openstreetmap.org/node/4691959567", 51.2128858, 4.4082370);
  var n13 = new _Node["default"]("http://www.openstreetmap.org/node/4691959568", 51.2128258, 4.4071835);
  var n14 = new _Node["default"]("http://www.openstreetmap.org/node/4691959569", 51.2127736, 4.4071085);
  var n15 = new _Node["default"]("http://www.openstreetmap.org/node/4691959570", 51.2127100, 4.4069567);
  var l1 = new _Line["default"]("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/4691959557", n1, n2);
  var l2 = new _Line["default"]("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607822120", n2, n3);
  var l3 = new _Line["default"]("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607832955", n3, n4);
  var l4 = new _Line["default"]("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607832954", n4, n5);
  var l5 = new _Line["default"]("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607832950", n5, n6);
  var l6 = new _Line["default"]("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607832953", n6, n7);
  var l7 = new _Line["default"]("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607822421", n7, n8);
  var l8 = new _Line["default"]("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607822443", n8, n9);
  var l9 = new _Line["default"]("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607832951", n9, n10);
  var l10 = new _Line["default"]("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607822427", n10, n11);
  var l11 = new _Line["default"]("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607822435", n11, n12);
  var l12 = new _Line["default"]("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/4691959567", n12, n13);
  var l13 = new _Line["default"]("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/4691959568", n13, n14);
  var l14 = new _Line["default"]("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/4691959569", n14, n15);
  var l15 = new _Line["default"]("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/4691959570", n15, n1);
  return {
    nodes: [n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12, n13, n14, n15],
    lines: [l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, l12, l13, l14, l15]
  };
}