"use strict";

var _MapDataBase = _interopRequireDefault(require("../map/MapDataBase"));

var _Helperfunctions = require("./Helperfunctions");

var _LineEncoder = _interopRequireDefault(require("../coder/LineEncoder"));

var _Line = _interopRequireDefault(require("../map/Line"));

var _Node = _interopRequireDefault(require("../map/Node"));

var _Location = _interopRequireDefault(require("../coder/Location"));

var _Encoder = _interopRequireDefault(require("../Encoder"));

var _Enum = require("../map/Enum");

var _openlrJs = require("openlr-js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

test('encode doesn\'t crash with lane existing of single line', function () {
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID.nodes,
      lines = _mapNodesLinesToID.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.singleLineLane.locationLines;

  var encoded = _LineEncoder["default"].encode(mapDataBase, locLines, 0, 0);

  expect(encoded.LRPs.length).toEqual(2);
}, 10000);
test('encode doesn\'t crash with lane existing of two lines', function () {
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID2 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID2.nodes,
      lines = _mapNodesLinesToID2.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.doubleLineLane.locationLines;

  var encoded = _LineEncoder["default"].encode(mapDataBase, locLines, 0, 0);

  expect(encoded.LRPs.length).toEqual(2);
});
test('encode doesn\'t crash with lane existing of two lines and valid offsets', function () {
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID3 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID3.nodes,
      lines = _mapNodesLinesToID3.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.doubleLineLane.locationLines;

  var encoded = _LineEncoder["default"].encode(mapDataBase, locLines, 10, 5);

  expect(encoded.LRPs.length).toEqual(2);
});
test('encode doesn\'t crash with lane existing of two lines and invalid offsets', function () {
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID4 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID4.nodes,
      lines = _mapNodesLinesToID4.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.doubleLineLane.locationLines;

  var encoded = _LineEncoder["default"].encode(mapDataBase, locLines, 5, 10);

  expect(encoded.LRPs.length).toEqual(2);
});
test('encode 4 lines no offsets no expansions', function () {
  var network = (0, _Helperfunctions.generateRealisticLengthTestNetwork)();
  var data = (0, _Helperfunctions.mapNodesLinesToID)(network.nodes, network.lines);
  var mapDataBase = new _MapDataBase["default"](data.lines, data.nodes);

  var LRPs = _LineEncoder["default"].encode(mapDataBase, [network.lines[9], network.lines[26], network.lines[7], network.lines[19], network.lines[23], network.lines[5]], 0, 0);

  expect(LRPs.LRPs.length).toEqual(4);
  expect(LRPs.LRPs[0].lat).toEqual(network.lines[9].getStartNode().getLatitudeDeg());
  expect(LRPs.LRPs[0]["long"]).toEqual(network.lines[9].getStartNode().getLongitudeDeg());
  expect(LRPs.LRPs[0].distanceToNext).toEqual(Math.round((network.lines[9].getLength() + network.lines[26].getLength()) / 100));
  expect(LRPs.LRPs[1].lat).toEqual(network.lines[7].getStartNode().getLatitudeDeg());
  expect(LRPs.LRPs[1]["long"]).toEqual(network.lines[7].getStartNode().getLongitudeDeg());
  expect(LRPs.LRPs[1].distanceToNext).toEqual(Math.round(network.lines[7].getLength() / 100));
  expect(LRPs.LRPs[2].lat).toEqual(network.lines[19].getStartNode().getLatitudeDeg());
  expect(LRPs.LRPs[2]["long"]).toEqual(network.lines[19].getStartNode().getLongitudeDeg());
  expect(LRPs.LRPs[2].distanceToNext).toEqual(Math.round((network.lines[19].getLength() + network.lines[23].getLength() + network.lines[5].getLength()) / 100));
  expect(LRPs.LRPs[3].lat).toEqual(network.lines[5].getEndNode().getLatitudeDeg());
  expect(LRPs.LRPs[3]["long"]).toEqual(network.lines[5].getEndNode().getLongitudeDeg());
  expect(LRPs.LRPs[3].distanceToNext).toEqual(0);
  expect(LRPs.posOffset).toEqual(0);
  expect(LRPs.negOffset).toEqual(0);
});
test('encode 4 lines no offsets with expansion', function () {
  var network = (0, _Helperfunctions.generateRealisticLengthTestNetwork)();
  var data = (0, _Helperfunctions.mapNodesLinesToID)(network.nodes, network.lines);
  var mapDataBase = new _MapDataBase["default"](data.lines, data.nodes);

  var LRPs = _LineEncoder["default"].encode(mapDataBase, [network.lines[26], network.lines[7], network.lines[19], network.lines[23]], 0, 0); //the startnodes of line 26 and line 23 are not valid, so they both should be expanded to include node 6 (line 18) and node 9 (line22)


  expect(LRPs.LRPs.length).toEqual(4);
  expect(LRPs.LRPs[0].lat).toEqual(network.lines[9].getStartNode().getLatitudeDeg());
  expect(LRPs.LRPs[0]["long"]).toEqual(network.lines[9].getStartNode().getLongitudeDeg());
  expect(LRPs.LRPs[0].distanceToNext).toEqual(Math.round((network.lines[9].getLength() + network.lines[26].getLength()) / 100));
  expect(LRPs.LRPs[1].lat).toEqual(network.lines[7].getStartNode().getLatitudeDeg());
  expect(LRPs.LRPs[1]["long"]).toEqual(network.lines[7].getStartNode().getLongitudeDeg());
  expect(LRPs.LRPs[1].distanceToNext).toEqual(Math.round(network.lines[7].getLength() / 100));
  expect(LRPs.LRPs[2].lat).toEqual(network.lines[19].getStartNode().getLatitudeDeg());
  expect(LRPs.LRPs[2]["long"]).toEqual(network.lines[19].getStartNode().getLongitudeDeg());
  expect(LRPs.LRPs[2].distanceToNext).toEqual(Math.round((network.lines[19].getLength() + network.lines[23].getLength() + network.lines[5].getLength()) / 100));
  expect(LRPs.LRPs[3].lat).toEqual(network.lines[5].getEndNode().getLatitudeDeg());
  expect(LRPs.LRPs[3]["long"]).toEqual(network.lines[5].getEndNode().getLongitudeDeg());
  expect(LRPs.LRPs[3].distanceToNext).toEqual(0);
  expect(LRPs.posOffset).toEqual(Math.round(network.lines[9].getLength() / 100));
  expect(LRPs.negOffset).toEqual(Math.round(network.lines[5].getLength() / 100));
});
test('encode 4 lines with expansion and valid offsets', function () {
  var network = (0, _Helperfunctions.generateRealisticLengthTestNetwork)();
  var data = (0, _Helperfunctions.mapNodesLinesToID)(network.nodes, network.lines);
  var mapDataBase = new _MapDataBase["default"](data.lines, data.nodes);

  var LRPs = _LineEncoder["default"].encode(mapDataBase, [network.lines[26], network.lines[7], network.lines[19], network.lines[23]], 30, 30); //the startnodes of line 26 and line 23 are not valid, so they both should be expanded to include node 6 (line 18) and node 9 (line22)


  expect(LRPs.LRPs.length).toEqual(4);
  expect(LRPs.LRPs[0].lat).toEqual(network.lines[9].getStartNode().getLatitudeDeg());
  expect(LRPs.LRPs[0]["long"]).toEqual(network.lines[9].getStartNode().getLongitudeDeg());
  expect(LRPs.LRPs[0].distanceToNext).toEqual(Math.round((network.lines[9].getLength() + network.lines[26].getLength()) / 100));
  expect(LRPs.LRPs[1].lat).toEqual(network.lines[7].getStartNode().getLatitudeDeg());
  expect(LRPs.LRPs[1]["long"]).toEqual(network.lines[7].getStartNode().getLongitudeDeg());
  expect(LRPs.LRPs[1].distanceToNext).toEqual(Math.round(network.lines[7].getLength() / 100));
  expect(LRPs.LRPs[2].lat).toEqual(network.lines[19].getStartNode().getLatitudeDeg());
  expect(LRPs.LRPs[2]["long"]).toEqual(network.lines[19].getStartNode().getLongitudeDeg());
  expect(LRPs.LRPs[2].distanceToNext).toEqual(Math.round((network.lines[19].getLength() + network.lines[23].getLength() + network.lines[5].getLength()) / 100));
  expect(LRPs.LRPs[3].lat).toEqual(network.lines[5].getEndNode().getLatitudeDeg());
  expect(LRPs.LRPs[3]["long"]).toEqual(network.lines[5].getEndNode().getLongitudeDeg());
  expect(LRPs.LRPs[3].distanceToNext).toEqual(0);
  expect(LRPs.posOffset).toEqual(Math.round((network.lines[9].getLength() + 3000) / 100));
  expect(LRPs.negOffset).toEqual(Math.round((network.lines[5].getLength() + 3000) / 100));
});
test('encode 4 lines with expansion and invalid pos offset', function () {
  var network = (0, _Helperfunctions.generateRealisticLengthTestNetwork)();
  var data = (0, _Helperfunctions.mapNodesLinesToID)(network.nodes, network.lines);
  var mapDataBase = new _MapDataBase["default"](data.lines, data.nodes);

  var LRPs = _LineEncoder["default"].encode(mapDataBase, [network.lines[26], network.lines[7], network.lines[19], network.lines[23]], Math.round(network.lines[26].getLength() / 100) + 30, 0); //the startnodes of line 26 and line 23 are not valid, so they both should be expanded to include node 6 (line 18) and node 9 (line22)
  //but the posOffset > the length of line 26 so it will be omitted and the next line 7's end node is valid, so no front expansion needed


  expect(LRPs.LRPs.length).toEqual(3);
  expect(LRPs.LRPs[0].lat).toEqual(network.lines[7].getStartNode().getLatitudeDeg());
  expect(LRPs.LRPs[0]["long"]).toEqual(network.lines[7].getStartNode().getLongitudeDeg());
  expect(LRPs.LRPs[0].distanceToNext).toEqual(Math.round(network.lines[7].getLength() / 100));
  expect(LRPs.LRPs[1].lat).toEqual(network.lines[19].getStartNode().getLatitudeDeg());
  expect(LRPs.LRPs[1]["long"]).toEqual(network.lines[19].getStartNode().getLongitudeDeg());
  expect(LRPs.LRPs[1].distanceToNext).toEqual(Math.round((network.lines[19].getLength() + network.lines[23].getLength() + network.lines[5].getLength()) / 100));
  expect(LRPs.LRPs[2].lat).toEqual(network.lines[5].getEndNode().getLatitudeDeg());
  expect(LRPs.LRPs[2]["long"]).toEqual(network.lines[5].getEndNode().getLongitudeDeg());
  expect(LRPs.LRPs[2].distanceToNext).toEqual(0);
  expect(LRPs.posOffset).toEqual(30);
  expect(LRPs.negOffset).toEqual(Math.round(network.lines[5].getLength() / 100));
});
test('encode 4 lines with expansion and invalid neg offset', function () {
  var network = (0, _Helperfunctions.generateRealisticLengthTestNetwork)();
  var data = (0, _Helperfunctions.mapNodesLinesToID)(network.nodes, network.lines);
  var mapDataBase = new _MapDataBase["default"](data.lines, data.nodes);

  var LRPs = _LineEncoder["default"].encode(mapDataBase, [network.lines[26], network.lines[7], network.lines[19], network.lines[23]], 0, Math.round(network.lines[23].getLength() / 100) + 30); //the startnodes of line 26 and line 23 are not valid, so they both should be expanded to include node 6 (line 18) and node 9 (line22)
  //but the negOffset > the length of line 23 so it will be omitted and the next line 19's end node is valid, so no end expansion needed


  console.info(LRPs.LRPs);
  expect(LRPs.LRPs.length).toEqual(2);
  expect(LRPs.LRPs[0].lat).toEqual(network.lines[9].getStartNode().getLatitudeDeg());
  expect(LRPs.LRPs[0]["long"]).toEqual(network.lines[9].getStartNode().getLongitudeDeg());
  expect(LRPs.LRPs[0].distanceToNext).toEqual(Math.round((network.lines[9].getLength() + network.lines[26].getLength() + network.lines[7].getLength() + network.lines[19].getLength()) / 100));
  expect(LRPs.LRPs[1].lat).toEqual(network.lines[19].getEndNode().getLatitudeDeg());
  expect(LRPs.LRPs[1]["long"]).toEqual(network.lines[19].getEndNode().getLongitudeDeg());
  expect(LRPs.LRPs[1].distanceToNext).toEqual(0);
  expect(LRPs.posOffset).toEqual(Math.round(network.lines[9].getLength() / 100));
  expect(LRPs.negOffset).toEqual(30);
});
test('checkValidityAndAdjustOffsets with end adjustments', function () {
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();
  var locLines = startData.doubleLineLane.locationLines;
  console.log(locLines[1].getLength());
  var offsets = {
    posOffset: 500,
    negOffset: 1000
  };
  var expected = locLines[0];

  _LineEncoder["default"].checkValidityAndAdjustOffsets(locLines, offsets);

  expect(offsets).toEqual({
    posOffset: 500,
    negOffset: 605
  });
  expect(locLines).toEqual([expected]);
});
test('checkValidityAndAdjustOffsets without adjustments', function () {
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();
  var locLines = startData.doubleLineLane;
  var offsets = {
    posOffset: 500,
    negOffset: 500
  };

  _LineEncoder["default"].checkValidityAndAdjustOffsets(locLines, offsets);

  expect(offsets).toEqual({
    posOffset: 500,
    negOffset: 500
  });
  expect(locLines).toEqual(locLines);
});
test('checkValidityAndAdjustOffsets with start adjustments', function () {
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();
  var locLines = startData.doubleLineLane.locationLines;
  console.log(locLines[0].getLength());
  var offsets = {
    posOffset: 1700,
    negOffset: 200
  };
  var expected = locLines[1];

  _LineEncoder["default"].checkValidityAndAdjustOffsets(locLines, offsets);

  expect(offsets).toEqual({
    posOffset: 63,
    negOffset: 200
  });
  expect(locLines).toEqual([expected]);
});
test('checkValidityAndAdjustOffsets with unconnected lanes', function () {
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();
  var locLines = startData.unconnectedLane.locationLines;
  var offsets = {
    posOffset: 0,
    negOffset: 0
  };
  expect(function () {
    _LineEncoder["default"].checkValidityAndAdjustOffsets(locLines, offsets);
  }).toThrow(Error("line isn't a connected path"));
});
test('checkValidityAndAdjustOffsets offsets longer then path', function () {
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();
  var locLines = startData.doubleLineLane.locationLines;
  var offsets = {
    posOffset: 3000,
    negOffset: 3000
  };
  var l1 = locLines[0].getLength();
  var l2 = locLines[1].getLength();
  expect(function () {
    _LineEncoder["default"].checkValidityAndAdjustOffsets(locLines, offsets);
  }).toThrow(Error("offsets longer than path: path=" + (l1 + l2) + " posOffset=3000 negOffset=3000"));
});
test('adjustToValidStartEnd with one invalid start node ', function () {
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID5 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID5.nodes,
      lines = _mapNodesLinesToID5.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.invalidStartNodeLane.locationLines;
  var locLinesLength = locLines.length;
  var offsets = {
    posOffset: 3000,
    negOffset: 3000
  };

  var expanded = _LineEncoder["default"].adjustToValidStartEnd(mapDataBase, locLines, offsets);

  expect(expanded).toEqual({
    front: 1,
    back: 0
  });
  expect(locLines.length).toEqual(locLinesLength + 1);
  expect(offsets).toEqual({
    posOffset: 3000 + lines[2].getLength(),
    negOffset: 3000
  });
});
test('adjustToValidStartEnd with one invalid end node ', function () {
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID6 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID6.nodes,
      lines = _mapNodesLinesToID6.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.invalidEndNodeLane.locationLines;
  var locLinesLength = locLines.length;
  var offsets = {
    posOffset: 3000,
    negOffset: 3000
  };

  var expanded = _LineEncoder["default"].adjustToValidStartEnd(mapDataBase, locLines, offsets);

  expect(expanded).toEqual({
    front: 0,
    back: 1
  });
  expect(locLines.length).toEqual(locLinesLength + 1);
  expect(offsets).toEqual({
    posOffset: 3000,
    negOffset: 3000 + lines[3].getLength()
  });
});
test('adjustToValidStartEnd with one invalid end node with 2 outgoing lines', function () {
  var node3 = new _Node["default"](3, 51.2120361, 4.3974671);
  var node4 = new _Node["default"](4, 51.2120058, 4.3976971);
  var node5 = new _Node["default"](5, 51.2120184, 4.3977501);
  var line1 = new _Line["default"](1, node3, node4);
  var line2 = new _Line["default"](2, node4, node5);
  var line3 = new _Line["default"](3, node5, node4);
  var line4 = new _Line["default"](4, node4, node3);
  node3.setLines([line4], [line1]);
  node4.setLines([line1, line3], [line2, line4]);
  node5.setLines([line2], [line3]);
  var nodelist = [node3, node4, node5];
  var linelist = [line1, line2, line3, line4];

  var _mapNodesLinesToID7 = (0, _Helperfunctions.mapNodesLinesToID)(nodelist, linelist),
      nodes = _mapNodesLinesToID7.nodes,
      lines = _mapNodesLinesToID7.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = [line1];
  var locLinesLength = locLines.length;
  var offsets = {
    posOffset: 3000,
    negOffset: 3000
  };

  var expanded = _LineEncoder["default"].adjustToValidStartEnd(mapDataBase, locLines, offsets);

  expect(expanded).toEqual({
    front: 0,
    back: 1
  });
  expect(locLines.length).toEqual(locLinesLength + 1);
  expect(offsets).toEqual({
    posOffset: 3000,
    negOffset: 3000 + lines[3].getLength()
  });
  expect(locLines[locLines.length - 1].getEndNode().getID()).toEqual(node5.getID());
});
test('adjustToValidStartEnd with one invalid end node with 2 outgoing lines other line list order', function () {
  var node3 = new _Node["default"](3, 51.2120361, 4.3974671);
  var node4 = new _Node["default"](4, 51.2120058, 4.3976971);
  var node5 = new _Node["default"](5, 51.2120184, 4.3977501);
  var line1 = new _Line["default"](1, node3, node4);
  var line2 = new _Line["default"](2, node4, node5);
  var line3 = new _Line["default"](3, node5, node4);
  var line4 = new _Line["default"](4, node4, node3);
  node3.setLines([line4], [line1]);
  node4.setLines([line3, line1], [line4, line2]);
  node5.setLines([line2], [line3]);
  var nodelist = [node3, node4, node5];
  var linelist = [line1, line2, line3, line4];

  var _mapNodesLinesToID8 = (0, _Helperfunctions.mapNodesLinesToID)(nodelist, linelist),
      nodes = _mapNodesLinesToID8.nodes,
      lines = _mapNodesLinesToID8.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = [line1];
  var locLinesLength = locLines.length;
  var offsets = {
    posOffset: 3000,
    negOffset: 3000
  };

  var expanded = _LineEncoder["default"].adjustToValidStartEnd(mapDataBase, locLines, offsets);

  expect(expanded).toEqual({
    front: 0,
    back: 1
  });
  expect(locLines.length).toEqual(locLinesLength + 1);
  expect(offsets).toEqual({
    posOffset: 3000,
    negOffset: 3000 + lines[3].getLength()
  });
  expect(locLines[locLines.length - 1].getEndNode().getID()).toEqual(node5.getID());
});
test('adjustToValidStartEnd with one invalid start node with 2 outgoing lines', function () {
  var node3 = new _Node["default"](3, 51.2120361, 4.3974671);
  var node4 = new _Node["default"](4, 51.2120058, 4.3976971);
  var node5 = new _Node["default"](5, 51.2120184, 4.3977501);
  var line1 = new _Line["default"](1, node3, node4);
  var line2 = new _Line["default"](2, node4, node5);
  var line3 = new _Line["default"](3, node5, node4);
  var line4 = new _Line["default"](4, node4, node3);
  node3.setLines([line4], [line1]);
  node4.setLines([line1, line3], [line2, line4]);
  node5.setLines([line2], [line3]);
  var nodelist = [node3, node4, node5];
  var linelist = [line1, line2, line3, line4];

  var _mapNodesLinesToID9 = (0, _Helperfunctions.mapNodesLinesToID)(nodelist, linelist),
      nodes = _mapNodesLinesToID9.nodes,
      lines = _mapNodesLinesToID9.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = [line2];
  var locLinesLength = locLines.length;
  var offsets = {
    posOffset: 3000,
    negOffset: 3000
  };

  var expanded = _LineEncoder["default"].adjustToValidStartEnd(mapDataBase, locLines, offsets);

  expect(expanded).toEqual({
    front: 1,
    back: 0
  });
  expect(locLines.length).toEqual(locLinesLength + 1);
  expect(offsets).toEqual({
    posOffset: 3000 + line1.getLength(),
    negOffset: 3000
  });
  expect(locLines[0].getStartNode().getID()).toEqual(node3.getID());
});
test('adjustToValidStartEnd with one invalid start node with 2 outgoing lines other line list order', function () {
  var node3 = new _Node["default"](3, 51.2120361, 4.3974671);
  var node4 = new _Node["default"](4, 51.2120058, 4.3976971);
  var node5 = new _Node["default"](5, 51.2120184, 4.3977501);
  var line1 = new _Line["default"](1, node3, node4);
  var line2 = new _Line["default"](2, node4, node5);
  var line3 = new _Line["default"](3, node5, node4);
  var line4 = new _Line["default"](4, node4, node3);
  node3.setLines([line4], [line1]);
  node4.setLines([line3, line1], [line4, line2]);
  node5.setLines([line2], [line3]);
  var nodelist = [node3, node4, node5];
  var linelist = [line1, line2, line3, line4];

  var _mapNodesLinesToID10 = (0, _Helperfunctions.mapNodesLinesToID)(nodelist, linelist),
      nodes = _mapNodesLinesToID10.nodes,
      lines = _mapNodesLinesToID10.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = [line2];
  var locLinesLength = locLines.length;
  var offsets = {
    posOffset: 3000,
    negOffset: 3000
  };

  var expanded = _LineEncoder["default"].adjustToValidStartEnd(mapDataBase, locLines, offsets);

  expect(expanded).toEqual({
    front: 1,
    back: 0
  });
  expect(locLines.length).toEqual(locLinesLength + 1);
  expect(offsets).toEqual({
    posOffset: 3000 + line1.getLength(),
    negOffset: 3000
  });
  expect(locLines[0].getStartNode().getID()).toEqual(node3.getID());
});
test('node is invalid 1 in 1 out', function () {
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();
  var locLines = startData.invalidStartNodeLane.locationLines;
  var invalidNode = locLines[0].getStartNode();

  var invalid = _LineEncoder["default"].nodeIsInValid(invalidNode);

  expect(invalid).toEqual(true);
});
test('node is valid 1 in 1 out', function () {
  var node3 = new _Node["default"](3, 51.2120361, 4.3974671);
  var node4 = new _Node["default"](4, 51.2120058, 4.3976971);
  var line1 = new _Line["default"](1, node3, node4);
  var line4 = new _Line["default"](4, node4, node3);
  node3.setLines([line4], [line1]);
  node4.setLines([line1], [line4]);

  var invalid = _LineEncoder["default"].nodeIsInValid(node3);

  expect(invalid).toEqual(false);
});
test('node is invalid 2 in 2 out', function () {
  var node3 = new _Node["default"](3, 51.2120361, 4.3974671);
  var node4 = new _Node["default"](4, 51.2120058, 4.3976971);
  var node5 = new _Node["default"](5, 51.2120184, 4.3977501);
  var line1 = new _Line["default"](1, node3, node4);
  var line2 = new _Line["default"](2, node4, node5);
  var line3 = new _Line["default"](3, node5, node4);
  var line4 = new _Line["default"](4, node4, node3);
  node3.setLines([line4], [line1]);
  node4.setLines([line1, line3], [line2, line4]);
  node5.setLines([line2], [line3]);

  var invalid = _LineEncoder["default"].nodeIsInValid(node4);

  expect(invalid).toEqual(true);
});
test('node is valid 2 in 1 out', function () {
  var node3 = new _Node["default"](3, 51.2120361, 4.3974671);
  var node4 = new _Node["default"](4, 51.2120058, 4.3976971);
  var node5 = new _Node["default"](5, 51.2120184, 4.3977501);
  var line1 = new _Line["default"](1, node3, node4);
  var line2 = new _Line["default"](2, node4, node5);
  var line3 = new _Line["default"](3, node5, node4);
  node3.setLines([], [line1]);
  node4.setLines([line1, line3], [line2]);
  node5.setLines([line2], [line3]);

  var invalid = _LineEncoder["default"].nodeIsInValid(node4);

  expect(invalid).toEqual(false);
});
test('node is valid 1 in 2 out', function () {
  var node3 = new _Node["default"](3, 51.2120361, 4.3974671);
  var node4 = new _Node["default"](4, 51.2120058, 4.3976971);
  var node5 = new _Node["default"](5, 51.2120184, 4.3977501);
  var line1 = new _Line["default"](1, node3, node4);
  var line2 = new _Line["default"](2, node4, node5);
  var line4 = new _Line["default"](4, node4, node3);
  node3.setLines([line4], [line1]);
  node4.setLines([line1], [line2, line4]);
  node5.setLines([line2], []);

  var invalid = _LineEncoder["default"].nodeIsInValid(node4);

  expect(invalid).toEqual(false);
});
test('node is valid 2 in 2 diff out', function () {
  var node3 = new _Node["default"](3, 51.2120361, 4.3974671);
  var node4 = new _Node["default"](4, 51.2120058, 4.3976971);
  var node5 = new _Node["default"](5, 51.2120184, 4.3977501);
  var node6 = new _Node["default"](6, 51.2120250, 4.3978910);
  var line1 = new _Line["default"](1, node3, node4);
  var line2 = new _Line["default"](2, node4, node5);
  var line3 = new _Line["default"](3, node5, node4);
  var line4 = new _Line["default"](4, node4, node6);
  node3.setLines([], [line1]);
  node4.setLines([line1, line3], [line2, line4]);
  node5.setLines([line2], [line3]);
  node6.setLines([line4], []);

  var invalid = _LineEncoder["default"].nodeIsInValid(node4);

  expect(invalid).toEqual(false);
});
test('node is valid 2 diff in 2 out', function () {
  var node3 = new _Node["default"](3, 51.2120361, 4.3974671);
  var node4 = new _Node["default"](4, 51.2120058, 4.3976971);
  var node5 = new _Node["default"](5, 51.2120184, 4.3977501);
  var node6 = new _Node["default"](6, 51.2120250, 4.3978910);
  var line1 = new _Line["default"](1, node3, node4);
  var line2 = new _Line["default"](2, node4, node5);
  var line3 = new _Line["default"](3, node6, node4);
  var line4 = new _Line["default"](4, node4, node3);
  node3.setLines([line4], [line1]);
  node4.setLines([line1, line3], [line2, line4]);
  node5.setLines([line2], []);
  node6.setLines([], [line3]);

  var invalid = _LineEncoder["default"].nodeIsInValid(node4);

  expect(invalid).toEqual(false);
});
test('checkShortestPathCoverage fully covered', function () {
  var network = (0, _Helperfunctions.generateTestNetwork)();
  var locationLines = [network.lines[5], network.lines[3], network.lines[4]];

  var checkResult = _LineEncoder["default"].checkShortestPathCoverage(0, locationLines, [network.lines[5], network.lines[3], network.lines[4]], 3);

  expect(checkResult.fullyCovered).toEqual(true);
  expect(checkResult.lrpIndexInLoc).toEqual(3);
  expect(checkResult.lrpIndexInSP).toEqual(3);
});
test('checkShortestPathCoverage fully covered 0 path length', function () {
  var network = (0, _Helperfunctions.generateTestNetwork)();
  var locationLines = [network.lines[5], network.lines[3], network.lines[4]];

  var checkResult = _LineEncoder["default"].checkShortestPathCoverage(1, locationLines, [], 2);

  expect(checkResult.fullyCovered).toEqual(true);
  expect(checkResult.lrpIndexInLoc).toEqual(2);
  expect(checkResult.lrpIndexInSP).toEqual(0);
});
test('checkShortestPathCoverage not fully covered 0 path length', function () {
  var network = (0, _Helperfunctions.generateTestNetwork)();
  var locationLines = [network.lines[5], network.lines[3], network.lines[4]];

  var checkResult = _LineEncoder["default"].checkShortestPathCoverage(1, locationLines, [], 3);

  expect(checkResult.fullyCovered).toEqual(false);
  expect(checkResult.lrpIndexInLoc).toEqual(1);
  expect(checkResult.lrpIndexInSP).toEqual(0);
});
test('checkShortestPathCoverage fully covered 1 path length', function () {
  var network = (0, _Helperfunctions.generateTestNetwork)();
  var locationLines = [network.lines[5], network.lines[3], network.lines[4]];

  var checkResult = _LineEncoder["default"].checkShortestPathCoverage(2, locationLines, [network.lines[4]], 3);

  expect(checkResult.fullyCovered).toEqual(true);
  expect(checkResult.lrpIndexInLoc).toEqual(3);
  expect(checkResult.lrpIndexInSP).toEqual(1);
});
test('checkShortestPathCoverage not fully covered 1 path length', function () {
  var network = (0, _Helperfunctions.generateTestNetwork)();
  var locationLines = [network.lines[5], network.lines[3], network.lines[4]];

  var checkResult = _LineEncoder["default"].checkShortestPathCoverage(2, locationLines, [network.lines[8]], 3);

  expect(checkResult.fullyCovered).toEqual(false);
  expect(checkResult.lrpIndexInLoc).toEqual(2);
  expect(checkResult.lrpIndexInSP).toEqual(0);
});
test('checkShortestPathCoverage fully covered part', function () {
  var network = (0, _Helperfunctions.generateTestNetwork)();
  var locationLines = [network.lines[5], network.lines[3], network.lines[4]];

  var checkResult = _LineEncoder["default"].checkShortestPathCoverage(1, locationLines, [network.lines[3], network.lines[4]], 3);

  expect(checkResult.fullyCovered).toEqual(true);
  expect(checkResult.lrpIndexInLoc).toEqual(3);
  expect(checkResult.lrpIndexInSP).toEqual(2);
});
test('checkShortestPathCoverage not fully covered', function () {
  var network = (0, _Helperfunctions.generateTestNetwork)();
  var locationLines = [network.lines[5], network.lines[3], network.lines[7]];

  var checkResult = _LineEncoder["default"].checkShortestPathCoverage(0, locationLines, [network.lines[5], network.lines[3], network.lines[4]], 3);

  expect(checkResult.fullyCovered).toEqual(false);
  expect(checkResult.lrpIndexInLoc).toEqual(2);
  expect(checkResult.lrpIndexInSP).toEqual(2);
});
test('checkShortestPathCoverage not fully covered part', function () {
  var network = (0, _Helperfunctions.generateTestNetwork)();
  var locationLines = [network.lines[5], network.lines[3], network.lines[7]];

  var checkResult = _LineEncoder["default"].checkShortestPathCoverage(1, locationLines, [network.lines[3], network.lines[4]], 3);

  expect(checkResult.fullyCovered).toEqual(false);
  expect(checkResult.lrpIndexInLoc).toEqual(2);
  expect(checkResult.lrpIndexInSP).toEqual(1);
});
test('checkShortestPathCoverage nothing covered', function () {
  var network = (0, _Helperfunctions.generateTestNetwork)();
  var locationLines = [network.lines[5], network.lines[3], network.lines[7]];

  var checkResult = _LineEncoder["default"].checkShortestPathCoverage(1, locationLines, [network.lines[6], network.lines[4]], 3);

  expect(checkResult.fullyCovered).toEqual(false);
  expect(checkResult.lrpIndexInLoc).toEqual(1);
  expect(checkResult.lrpIndexInSP).toEqual(0);
});
test('checkShortestPathCoverage undefined param', function () {
  var network = (0, _Helperfunctions.generateTestNetwork)();
  var locationLines = [network.lines[5], network.lines[3], network.lines[7]];
  expect(function () {
    _LineEncoder["default"].checkShortestPathCoverage(undefined, locationLines, [network.lines[6], network.lines[4]], 3);
  }).toThrow(Error("One of the parameters is undefined."));
  expect(function () {
    _LineEncoder["default"].checkShortestPathCoverage(0, undefined, [network.lines[6], network.lines[4]], 3);
  }).toThrow(Error("One of the parameters is undefined."));
  expect(function () {
    _LineEncoder["default"].checkShortestPathCoverage(0, locationLines, undefined, 3);
  }).toThrow(Error("One of the parameters is undefined."));
  expect(function () {
    _LineEncoder["default"].checkShortestPathCoverage(0, locationLines, [network.lines[6], network.lines[4]], undefined);
  }).toThrow(Error("One of the parameters is undefined."));
});
test('checkShortestPathCoverage lEndIndex > lStartIndex', function () {
  var network = (0, _Helperfunctions.generateTestNetwork)();
  var locationLines = [network.lines[5], network.lines[3], network.lines[7]];
  expect(function () {
    _LineEncoder["default"].checkShortestPathCoverage(10, locationLines, [network.lines[6], network.lines[4]], 3);
  }).toThrow(Error("lStartIndex can't be greater than lEndIndex"));
});
test('checkShortestPathCoverage lEndIndex > lines.length', function () {
  var network = (0, _Helperfunctions.generateTestNetwork)();
  var locationLines = [network.lines[5], network.lines[3], network.lines[7]];
  expect(function () {
    _LineEncoder["default"].checkShortestPathCoverage(0, locationLines, [network.lines[6], network.lines[4]], 10);
  }).toThrow(Error("lEndIndex can't be greater than lines.length"));
});
test('checkShortestPathCoverage not fully covered part with lEndIndex', function () {
  var network = (0, _Helperfunctions.generateTestNetwork)();
  var locationLines = [network.lines[5], network.lines[3], network.lines[7], network[13]];

  var checkResult = _LineEncoder["default"].checkShortestPathCoverage(1, locationLines, [network.lines[3], network.lines[4]], 3);

  expect(checkResult.fullyCovered).toEqual(false);
  expect(checkResult.lrpIndexInLoc).toEqual(2);
  expect(checkResult.lrpIndexInSP).toEqual(1);
});
test('checkShortestPathCoverage fully covered part with lEndIndex', function () {
  var network = (0, _Helperfunctions.generateTestNetwork)();
  var locationLines = [network.lines[5], network.lines[3], network.lines[4], network.lines[9]];

  var checkResult = _LineEncoder["default"].checkShortestPathCoverage(1, locationLines, [network.lines[3], network.lines[4]], 3);

  expect(checkResult.fullyCovered).toEqual(true);
  expect(checkResult.lrpIndexInLoc).toEqual(3);
  expect(checkResult.lrpIndexInSP).toEqual(2);
});
test('addLRPsUntilFullyCovered fully covered', function () {
  var network = (0, _Helperfunctions.generateTestNetwork)();
  var checkResult = {
    fullyCovered: true,
    lrpIndexInSP: 0,
    lrpIndexInLoc: 1
  };
  var locLines = [network.lines[5], network.lines[3], network.lines[4]]; // let lrpNodes = [network.nodes[2]];

  var lrpLines = [network.lines[5]];
  var shortestPaths = [[network.lines[3]]];
  var expanded = {
    front: 0,
    end: 0
  };

  _LineEncoder["default"].addLRPsUntilFullyCovered(checkResult, locLines, lrpLines, shortestPaths, [network.lines[3]], expanded); // expect(lrpNodes.length).toEqual(2);
  // expect(lrpNodes[1].getID()).toEqual(network.nodes[8].getID());


  expect(lrpLines.length).toEqual(2);
  expect(lrpLines[1].getID()).toEqual(network.lines[4].getID());
  expect(shortestPaths.length).toEqual(1);
});
test('addLRPsUntilFullyCovered extra lrp needed', function () {
  var network = (0, _Helperfunctions.generateTestNetwork)();
  var checkResult = {
    fullyCovered: false,
    lrpIndexInSP: 1,
    lrpIndexInLoc: 1
  };
  var locLines = [network.lines[26], network.lines[7], network.lines[19], network.lines[23]]; // let lrpNodes = [network.nodes[9]];

  var lrpLines = [network.lines[26]];
  var shortestPaths = [[network.lines[26], network.lines[24], network.lines[23]]];
  var expanded = {
    front: 0,
    back: 0
  };

  _LineEncoder["default"].addLRPsUntilFullyCovered(checkResult, locLines, lrpLines, shortestPaths, [network.lines[26], network.lines[24], network.lines[23]], expanded); // expect(lrpNodes.length).toEqual(3);
  // expect(lrpNodes[1].getID()).toEqual(network.nodes[7].getID());
  // expect(lrpNodes[2].getID()).toEqual(network.nodes[2].getID());


  expect(lrpLines.length).toEqual(3);
  expect(lrpLines[1].getID()).toEqual(network.lines[7].getID());
  expect(lrpLines[2].getID()).toEqual(network.lines[23].getID());
  expect(shortestPaths.length).toEqual(2);
});
test('addLRPsUntilFullyCovered single lrp line location', function () {
  var network = (0, _Helperfunctions.generateTestNetwork)();
  var checkResult = {
    fullyCovered: true,
    lrpIndexInSP: 1,
    lrpIndexInLoc: 1
  };
  var locLines = [network.lines[26]];
  var lrpLines = [network.lines[26]];
  var shortestPaths = [[network.lines[13]]];
  var expanded = {
    front: 0,
    back: 0
  };

  _LineEncoder["default"].addLRPsUntilFullyCovered(checkResult, locLines, lrpLines, shortestPaths, [network.lines[13]], expanded);

  expect(lrpLines.length).toEqual(2);
  expect(lrpLines[0].getID()).toEqual(network.lines[26].getID());
  expect(lrpLines[1].getID()).toEqual(network.lines[26].getID());
  expect(shortestPaths.length).toEqual(1);
});
test('addLRPsUntilFullyCovered 2 lrp line location', function () {
  var network = (0, _Helperfunctions.generateTestNetwork)();
  var checkResult = {
    fullyCovered: true,
    lrpIndexInSP: 1,
    lrpIndexInLoc: 1
  };
  var locLines = [network.lines[26], network.lines[7]];
  var lrpLines = [network.lines[26]];
  var shortestPaths = [[]];
  var expanded = {
    front: 0,
    back: 0
  };

  _LineEncoder["default"].addLRPsUntilFullyCovered(checkResult, locLines, lrpLines, shortestPaths, [], expanded);

  expect(lrpLines.length).toEqual(2);
  expect(lrpLines[0].getID()).toEqual(network.lines[26].getID());
  expect(lrpLines[1].getID()).toEqual(network.lines[7].getID());
  expect(shortestPaths.length).toEqual(1);
}); //todo: test addLRPsUntilFullyCovered else structure? indien die kan voorkomen

test('concatenateAndValidateShortestPaths valid', function () {
  var network = (0, _Helperfunctions.generateRealisticLengthTestNetwork)(); // let locLines = [network.lines[26],network.lines[7],network.lines[19],network.lines[23]];

  var lrpLines = [network.lines[26], network.lines[7], network.lines[23]];
  var shortestPaths = [{
    lines: [network.lines[24]]
  }, {
    lines: [network.lines[19]]
  }];
  var offsets = {
    posOffset: 0,
    netOffset: 0
  };

  var concatenatedSPResult = _LineEncoder["default"].concatenateAndValidateShortestPaths(lrpLines, shortestPaths, offsets);

  expect(concatenatedSPResult.isValid).toEqual(true);
  expect(concatenatedSPResult.wrongPosOffset).toEqual(false);
  expect(concatenatedSPResult.wrongNegOffset).toEqual(false);
  expect(concatenatedSPResult.wrongIntermediateDistance).toEqual(false);
  expect(concatenatedSPResult.distanceBetweenFirstTwo).toEqual(network.lines[26].getLength());
  expect(concatenatedSPResult.distanceBetweenLastTwo).toEqual(network.lines[19].getLength() + network.lines[23].getLength() + network.lines[7].getLength());
  expect(concatenatedSPResult.shortestPath[0].getID()).toEqual(network.lines[26].getID());
  expect(concatenatedSPResult.shortestPath[1].getID()).toEqual(network.lines[7].getID());
  expect(concatenatedSPResult.shortestPath[2].getID()).toEqual(network.lines[19].getID());
  expect(concatenatedSPResult.shortestPath[3].getID()).toEqual(network.lines[23].getID());
});
test('concatenateAndValidateShortestPaths valid 2 LRP lines with wrong SP between', function () {
  var network = (0, _Helperfunctions.generateRealisticLengthTestNetwork)();
  var lrpLines = [network.lines[26], network.lines[7]];
  var shortestPaths = [{
    lines: [network.lines[13]]
  }];
  var offsets = {
    posOffset: 0,
    netOffset: 0
  };

  var concatenatedSPResult = _LineEncoder["default"].concatenateAndValidateShortestPaths(lrpLines, shortestPaths, offsets);

  expect(concatenatedSPResult.isValid).toEqual(true);
  expect(concatenatedSPResult.wrongPosOffset).toEqual(false);
  expect(concatenatedSPResult.wrongNegOffset).toEqual(false);
  expect(concatenatedSPResult.wrongIntermediateDistance).toEqual(false);
  expect(concatenatedSPResult.distanceBetweenFirstTwo).toEqual(network.lines[26].getLength() + network.lines[7].getLength());
  expect(concatenatedSPResult.distanceBetweenLastTwo).toEqual(network.lines[26].getLength() + network.lines[7].getLength());
  expect(concatenatedSPResult.shortestPath[0].getID()).toEqual(network.lines[26].getID());
  expect(concatenatedSPResult.shortestPath[1].getID()).toEqual(network.lines[7].getID());
});
test('concatenateAndValidateShortestPaths 1 line', function () {
  var network = (0, _Helperfunctions.generateRealisticLengthTestNetwork)(); // let locLines = [network.lines[26],network.lines[7],network.lines[19],network.lines[23]];

  var lrpLines = [network.lines[26], network.lines[26]];
  var shortestPaths = [{
    lines: [network.lines[13]]
  }];
  var offsets = {
    posOffset: 0,
    netOffset: 0
  };

  var concatenatedSPResult = _LineEncoder["default"].concatenateAndValidateShortestPaths(lrpLines, shortestPaths, offsets);

  expect(concatenatedSPResult.isValid).toEqual(true);
  expect(concatenatedSPResult.wrongPosOffset).toEqual(false);
  expect(concatenatedSPResult.wrongNegOffset).toEqual(false);
  expect(concatenatedSPResult.wrongIntermediateDistance).toEqual(false);
  expect(concatenatedSPResult.distanceBetweenFirstTwo).toEqual(network.lines[26].getLength());
  expect(concatenatedSPResult.distanceBetweenLastTwo).toEqual(network.lines[26].getLength());
  expect(concatenatedSPResult.shortestPath.length).toEqual(1);
  expect(concatenatedSPResult.shortestPath[0].getID()).toEqual(network.lines[26].getID());
});
test('concatenateAndValidateShortestPaths wrongPosOffset', function () {
  var network = (0, _Helperfunctions.generateRealisticLengthTestNetwork)(); // let locLines = [network.lines[26],network.lines[7],network.lines[19],network.lines[23]];

  var lrpLines = [network.lines[26], network.lines[7], network.lines[23]];
  var shortestPaths = [{
    lines: [network.lines[24]]
  }, {
    lines: [network.lines[19]]
  }];
  var offsets = {
    posOffset: 1000000,
    netOffset: 0
  };

  var concatenatedSPResult = _LineEncoder["default"].concatenateAndValidateShortestPaths(lrpLines, shortestPaths, offsets);

  expect(concatenatedSPResult.isValid).toEqual(false);
  expect(concatenatedSPResult.wrongPosOffset).toEqual(true);
  expect(concatenatedSPResult.wrongNegOffset).toEqual(false);
  expect(concatenatedSPResult.wrongIntermediateDistance).toEqual(false);
  expect(concatenatedSPResult.distanceBetweenFirstTwo).toEqual(network.lines[26].getLength());
  expect(concatenatedSPResult.distanceBetweenLastTwo).toEqual(network.lines[7].getLength() + network.lines[19].getLength() + network.lines[23].getLength());
  expect(concatenatedSPResult.shortestPath[0].getID()).toEqual(network.lines[26].getID());
  expect(concatenatedSPResult.shortestPath[1].getID()).toEqual(network.lines[7].getID());
  expect(concatenatedSPResult.shortestPath[2].getID()).toEqual(network.lines[19].getID());
  expect(concatenatedSPResult.shortestPath[3].getID()).toEqual(network.lines[23].getID());
});
test('concatenateAndValidateShortestPaths wrongNegOFfset', function () {
  var network = (0, _Helperfunctions.generateRealisticLengthTestNetwork)(); // let locLines = [network.lines[26],network.lines[7],network.lines[19],network.lines[23]];

  var lrpLines = [network.lines[26], network.lines[7], network.lines[23]];
  var shortestPaths = [{
    lines: [network.lines[24]]
  }, {
    lines: [network.lines[19]]
  }];
  var offsets = {
    posOffset: 0,
    negOffset: 1000000
  };

  var concatenatedSPResult = _LineEncoder["default"].concatenateAndValidateShortestPaths(lrpLines, shortestPaths, offsets);

  expect(concatenatedSPResult.isValid).toEqual(false);
  expect(concatenatedSPResult.wrongPosOffset).toEqual(false);
  expect(concatenatedSPResult.wrongNegOffset).toEqual(true);
  expect(concatenatedSPResult.wrongIntermediateDistance).toEqual(false);
  expect(concatenatedSPResult.distanceBetweenFirstTwo).toEqual(network.lines[26].getLength());
  expect(concatenatedSPResult.distanceBetweenLastTwo).toEqual(network.lines[7].getLength() + network.lines[19].getLength() + network.lines[23].getLength());
  expect(concatenatedSPResult.shortestPath[0].getID()).toEqual(network.lines[26].getID());
  expect(concatenatedSPResult.shortestPath[1].getID()).toEqual(network.lines[7].getID());
  expect(concatenatedSPResult.shortestPath[2].getID()).toEqual(network.lines[19].getID());
  expect(concatenatedSPResult.shortestPath[3].getID()).toEqual(network.lines[23].getID());
});
test('concatenateAndValidateShortestPaths wrong shortestPaths length', function () {
  var network = (0, _Helperfunctions.generateRealisticLengthTestNetwork)(); // let locLines = [network.lines[26],network.lines[7],network.lines[19],network.lines[23]];

  var lrpLines = [network.lines[26], network.lines[7], network.lines[23], network.lines[10]];
  var shortestPaths = [{
    lines: [network.lines[24]]
  }, {
    lines: [network.lines[19]]
  }];
  var offsets = {
    posOffset: 0,
    negOffset: 0
  };
  expect(function () {
    _LineEncoder["default"].concatenateAndValidateShortestPaths(lrpLines, shortestPaths, offsets);
  }).toThrow(Error("the amount of shortest paths is not one less than the amount of lrp nodes"));
});
test('removeLRPatFront', function () {
  var network = (0, _Helperfunctions.generateRealisticLengthTestNetwork)();
  var lrpLines = [network.lines[26], network.lines[7], network.lines[19], network.lines[23]];
  var shortestPaths = [{}, {}, {}];
  var lines = [network.lines[26], network.lines[7], network.lines[19], network.lines[23]];
  var offsets = {
    posOffset: 60000,
    negOffset: 0
  };

  _LineEncoder["default"].removeLRPatFront(lrpLines, shortestPaths, lines, offsets, 50000);

  expect(lrpLines.length).toEqual(3);
  expect(shortestPaths.length).toEqual(2);
  expect(lines.length).toEqual(3);
  expect(lrpLines[0].getID()).toEqual(network.lines[7].getID());
  expect(offsets.posOffset).toEqual(10000);
  expect(offsets.negOffset).toEqual(0);
});
test('removeLRPatFront unnecessary', function () {
  var network = (0, _Helperfunctions.generateRealisticLengthTestNetwork)();
  var lrpLines = [network.lines[26], network.lines[7], network.lines[19], network.lines[23]];
  var shortestPaths = [{}, {}, {}];
  var lines = [network.lines[26], network.lines[7], network.lines[19], network.lines[23]];
  var offsets = {
    posOffset: 40000,
    negOffset: 0
  };
  expect(function () {
    _LineEncoder["default"].removeLRPatFront(lrpLines, shortestPaths, lines, offsets, 50000);
  }).toThrow(Error("unnecessary removing of LRP at front"));
});
test('removeLRPatEnd', function () {
  var network = (0, _Helperfunctions.generateRealisticLengthTestNetwork)();
  var lrpLines = [network.lines[26], network.lines[7], network.lines[19], network.lines[23]];
  var shortestPaths = [{}, {}, {}];
  var lines = [network.lines[26], network.lines[7], network.lines[19], network.lines[23]];
  var offsets = {
    posOffset: 0,
    negOffset: 50000
  };

  _LineEncoder["default"].removeLRPatEnd(lrpLines, shortestPaths, lines, offsets, 20000);

  expect(lrpLines.length).toEqual(3);
  expect(shortestPaths.length).toEqual(2);
  expect(lines.length).toEqual(3);
  expect(lrpLines[2].getID()).toEqual(network.lines[19].getID());
  expect(offsets.posOffset).toEqual(0);
  expect(offsets.negOffset).toEqual(30000);
});
test('removeLRPatEnd unnecessary', function () {
  var network = (0, _Helperfunctions.generateRealisticLengthTestNetwork)();
  var lrpLines = [network.lines[26], network.lines[7], network.lines[19], network.lines[23]];
  var shortestPaths = [{}, {}, {}];
  var lines = [network.lines[26], network.lines[7], network.lines[19], network.lines[23]];
  var offsets = {
    posOffset: 0,
    negOffset: 30000
  };
  expect(function () {
    _LineEncoder["default"].removeLRPatEnd(lrpLines, shortestPaths, lines, offsets, 50000);
  }).toThrow(Error("unnecessary removing of LRP at end"));
});
test("adjustToValidStartEnd way on loop without junctions, so infinite expansion would occur if not taken care of in code", function () {
  var network = (0, _Helperfunctions.loadRTtestNetworkWithLoop)();
  var data = (0, _Helperfunctions.mapNodesLinesToID)(network.nodes, network.lines);
  var mapDatabase = new _MapDataBase["default"](data.lines, data.nodes);

  var expanded = _LineEncoder["default"].adjustToValidStartEnd(mapDatabase, [mapDatabase.lines["http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/4691959557"]], {
    posOffset: 0,
    negOffset: 0
  });

  expect(expanded.front).toEqual(0);
  expect(expanded.back).toEqual(0);
});
test("encode way on loop without junctions, so infinite expansion would occur if not taken care of in code", function () {
  var network = (0, _Helperfunctions.loadRTtestNetworkWithLoop)();
  var data = (0, _Helperfunctions.mapNodesLinesToID)(network.nodes, network.lines);
  var mapDatabase = new _MapDataBase["default"](data.lines, data.nodes);

  var encoded = _LineEncoder["default"].encode(mapDatabase, [mapDatabase.lines["http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/4691959557"]], 0, 0);

  expect(encoded).toBeDefined();
  expect(encoded.LRPs.length).toEqual(2);
  expect(encoded.posOffset).toEqual(0);
  expect(encoded.negOffset).toEqual(0);
});
test.skip('encode lane existing of two lines can be binary encoded and decoded', function () {
  expect.assertions(1);
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID11 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID11.nodes,
      lines = _mapNodesLinesToID11.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.doubleLineLane.locationLines;
  var location = new _Location["default"](_Enum.locationTypeEnum.LINE_LOCATION, 1);
  location.locationLines = locLines;
  location.posOffset = 0;
  location.negOffset = 0;

  var jsonEncoded = _Encoder["default"].encode(location, mapDataBase, 0, 0); // //encode binary
  // const binaryEncoder = new BinaryEncoder();
  // const rawLocationReference = Serializer.deserialize(jsonEncoded);
  // const locationReference = binaryEncoder.encodeDataFromRLR(rawLocationReference);
  // const openLrBinary = locationReference.getLocationReferenceData();
  // const openLrString = openLrBinary.toString('base64');
  //
  // const binaryDecoder = new BinaryDecoder();
  //
  // const openLrBinary2 = Buffer.from(openLrString, 'base64');
  // const locationReference2 = LocationReference.fromIdAndBuffer('binary', openLrBinary2);
  // const rawLocationReference2 = binaryDecoder.decodeData(locationReference2);
  // const jsonObject = Serializer.serialize(rawLocationReference2);
  // console.log(jsonEncoded.properties);
  // expect(jsonObject).toEqual(jsonEncoded);


  var binaryEncoder = new _openlrJs.BinaryEncoder();
  var jsonObject2 = {
    "type": "RawLineLocationReference",
    "properties": {
      "_id": "binary",
      "_locationType": 1,
      "_returnCode": null,
      "_points": {
        "type": "Array",
        "properties": [{
          "type": "LocationReferencePoint",
          "properties": {
            "_bearing": 129.375,
            "_distanceToNext": 205,
            "_frc": 6,
            "_fow": 3,
            "_lfrcnp": 6,
            "_isLast": false,
            "_longitude": 3.7538936137926395,
            "_latitude": 52.374883889902236,
            "_sequenceNumber": 1
          }
        }, {
          "type": "LocationReferencePoint",
          "properties": {
            "_bearing": 309.375,
            "_distanceToNext": 0,
            "_frc": 6,
            "_fow": 3,
            "_lfrcnp": 7,
            "_isLast": true,
            "_longitude": 4.7563336137926395,
            "_latitude": 52.373583889902235,
            "_sequenceNumber": 2
          }
        }]
      },
      "_offsets": {
        "type": "Offsets",
        "properties": {
          "_pOffset": 0,
          "_nOffset": 0,
          "_version": 3,
          "_pOffRelative": 0,
          "_nOffRelative": 0
        }
      }
    }
  };

  var rawLocationReference2 = _openlrJs.Serializer.deserialize(jsonObject2);

  var locationReference2 = binaryEncoder.encodeDataFromRLR(rawLocationReference2);
  var openLrBinary2 = locationReference2.getLocationReferenceData();
  var openLrString2 = openLrBinary2.toString('base64');
  console.log(openLrString2);
  var binaryDecoder = new _openlrJs.BinaryDecoder(); // const openLrString = 'CwNhbCU+jzPLAwD0/34zGw==';

  var openLrBinary = Buffer.from(openLrString2, 'base64');

  var locationReference = _openlrJs.LocationReference.fromIdAndBuffer('binary', openLrBinary);

  var rawLocationReference = binaryDecoder.decodeData(locationReference);

  var jsonObject = _openlrJs.Serializer.serialize(rawLocationReference);

  console.log(jsonObject); // expect(openLrString2).toEqual(openLrString);

  expect(jsonObject).toEqual(jsonObject2);
});