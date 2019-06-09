"use strict";

var _Helperfunctions = require("../../OpenLR/test/Helperfunctions");

var _MapDataBase = _interopRequireDefault(require("../../OpenLR/map/MapDataBase"));

var _LineEncoder = _interopRequireDefault(require("../../OpenLR/coder/LineEncoder"));

var _LineDecoder = _interopRequireDefault(require("../../OpenLR/coder/LineDecoder"));

var _OSMIntegration = _interopRequireDefault(require("../OSMIntegration"));

var _ParseData = require("../../Data/ParseData");

var _CoderSettings = require("../../OpenLR/coder/CoderSettings");

var _Enum = require("../../OpenLR/map/Enum");

var _LoadTestData = require("../../Data/LoadTestData");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

test('initMapDataBase initialization', function (done) {
  expect.assertions(5);
  var osmDataBase = new _MapDataBase["default"]();
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          _OSMIntegration["default"].initMapDataBase(osmDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          expect(osmDataBase).toBeDefined();
          expect(osmDataBase.lines.length).not.toEqual(0);
          expect(osmDataBase.nodes.length).not.toEqual(0);
          expect(osmDataBase.nodes[28929726].getLatitudeDeg()).toEqual(51.2120497);
          expect(osmDataBase.nodes[28929726].getLongitudeDeg()).toEqual(4.3971693); //https://www.openstreetmap.org/api/0.6/node/28929726
          // expect(osmDataBase.nodes[28929726].getDistance(51.2120361,4.3974671)).toEqual(20.82);

          done();
        });
      });
    });
  });
});
test('full osm integration test singleLineLane', function (done) {
  expect.assertions(4);
  var decoderProperties = {
    dist: 35,
    //maximum distance of a candidate node to a LRP
    bearDiff: 60,
    //maximum difference between the bearing of a candidate node and that of a LRP
    frcDiff: 3,
    //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 2,
    //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 100,
    //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: false,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
  };
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID.nodes,
      lines = _mapNodesLinesToID.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.singleLineLane.locationLines;

  var LRPs = _LineEncoder["default"].encode(mapDataBase, locLines, 0, 0);

  var osmDataBase = new _MapDataBase["default"]();
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          _OSMIntegration["default"].initMapDataBase(osmDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          var decoded = _LineDecoder["default"].decode(osmDataBase, LRPs.LRPs, LRPs.posOffset, LRPs.negOffset, decoderProperties);

          expect(decoded.lines.length).toEqual(1);
          expect(decoded.lines[0].getID()).toEqual("4579317_28929725_1");
          expect(decoded.posOffset).toEqual(0);
          expect(decoded.negOffset).toEqual(0);
          done();
        });
      });
    });
  });
});
describe("tests using configProperties in meter", function () {
  beforeEach(function () {
    _CoderSettings.configProperties.internalPrecision = _Enum.internalPrecisionEnum.METER;
    _CoderSettings.configProperties.bearDist = 20;
  });
  test('full osm integration test singleLineLane configProperties internalPrecision is meter', function (done) {
    expect.assertions(5);
    var decoderProperties = {
      dist: 35,
      //maximum distance of a candidate node to a LRP
      bearDiff: 60,
      //maximum difference between the bearing of a candidate node and that of a LRP
      frcDiff: 3,
      //maximum difference between the FRC of a candidate node and that of a LRP
      lfrcnpDiff: 2,
      //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
      distanceToNextDiff: 100,
      //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
      alwaysUseProjections: false,
      distMultiplier: 40,
      frcMultiplier: 10,
      fowMultiplier: 20,
      bearMultiplier: 30,
      maxSPSearchRetries: 50
    };
    var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

    var _mapNodesLinesToID2 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
        nodes = _mapNodesLinesToID2.nodes,
        lines = _mapNodesLinesToID2.lines;

    var mapDataBase = new _MapDataBase["default"](lines, nodes);
    var locLines = startData.singleLineLane.locationLines;

    var LRPs = _LineEncoder["default"].encode(mapDataBase, locLines, 0, 0);

    var osmDataBase = new _MapDataBase["default"]();
    (0, _LoadTestData.loadOsmTestData)().then(function (data) {
      (0, _ParseData.parseToJson)(data).then(function (json) {
        (0, _ParseData.getMappedElements)(json).then(function (elements) {
          (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
            _OSMIntegration["default"].initMapDataBase(osmDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

            var decoded = _LineDecoder["default"].decode(osmDataBase, LRPs.LRPs, LRPs.posOffset, LRPs.negOffset, decoderProperties);

            expect(decoded.lines.length).toEqual(1);
            expect(decoded.lines[0].getID()).toEqual("4579317_28929725_1");
            expect(decoded.lines[0].getLength()).toEqual(142); // in meter!

            expect(decoded.posOffset).toEqual(0);
            expect(decoded.negOffset).toEqual(0);
            done();
          });
        });
      });
    });
  });
  afterEach(function () {
    _CoderSettings.configProperties.internalPrecision = _Enum.internalPrecisionEnum.CENTIMETER;
    _CoderSettings.configProperties.bearDist = 2000;
  });
});
test('full osm integration test singleLineLane with projections', function (done) {
  expect.assertions(4);
  var decoderProperties = {
    dist: 35,
    //maximum distance of a candidate node to a LRP
    bearDiff: 60,
    //maximum difference between the bearing of a candidate node and that of a LRP
    frcDiff: 3,
    //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 2,
    //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 100,
    //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: true,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
  };
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID3 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID3.nodes,
      lines = _mapNodesLinesToID3.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.singleLineLane.locationLines;

  var LRPs = _LineEncoder["default"].encode(mapDataBase, locLines, 0, 0);

  var osmDataBase = new _MapDataBase["default"]();
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          _OSMIntegration["default"].initMapDataBase(osmDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          var decoded = _LineDecoder["default"].decode(osmDataBase, LRPs.LRPs, LRPs.posOffset, LRPs.negOffset, decoderProperties);

          expect(decoded.lines.length).toEqual(1);
          expect(decoded.lines[0].getID()).toEqual("4579317_28929725_1");
          expect(decoded.posOffset).toEqual(20);
          expect(decoded.negOffset).toEqual(4);
          done();
        });
      });
    });
  });
});
test('full osm integration test doubleLineLane', function (done) {
  expect.assertions(4);
  var decoderProperties = {
    dist: 35,
    //maximum distance of a candidate node to a LRP
    bearDiff: 60,
    //maximum difference between the bearing of a candidate node and that of a LRP
    frcDiff: 3,
    //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 2,
    //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 100,
    //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: false,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
  };
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID4 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID4.nodes,
      lines = _mapNodesLinesToID4.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.doubleLineLane.locationLines;

  var LRPs = _LineEncoder["default"].encode(mapDataBase, locLines, 0, 0);

  var osmDataBase = new _MapDataBase["default"]();
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          _OSMIntegration["default"].initMapDataBase(osmDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          var decoded = _LineDecoder["default"].decode(osmDataBase, LRPs.LRPs, LRPs.posOffset, LRPs.negOffset, decoderProperties);

          expect(decoded.lines.length).toEqual(1);
          expect(decoded.lines[0].getID()).toEqual("4579317_28929725_1");
          expect(decoded.posOffset).toEqual(0);
          expect(decoded.negOffset).toEqual(Math.round(osmDataBase.lines["4579317_28929725_1"].getLength() / 100) - 40);
          done();
        });
      });
    });
  });
});
test('full osm integration integration previously crashing because bad length calculation', function (done) {
  expect.assertions(4);
  var decoderProperties = {
    dist: 35,
    //maximum distance of a candidate node to a LRP
    bearDiff: 60,
    //maximum difference between the bearing of a candidate node and that of a LRP
    frcDiff: 3,
    //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 2,
    //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 100,
    //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: true,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
  };
  var LRP_0 = {
    bearing: 36.15816556660661,
    distanceToNext: 33,
    fow: 0,
    frc: 7,
    isLast: false,
    lat: 51.21201178548282,
    lfrcnp: 7,
    "long": 4.397157132625581,
    seqNr: 1
  };
  var LRP_1 = {
    bearing: 287.9390391708996,
    distanceToNext: 0,
    fow: 0,
    frc: 7,
    isLast: true,
    lat: 51.211979860833395,
    lfrcnp: 7,
    "long": 4.397580921649934,
    seqNr: 2
  };
  var LRPs = [LRP_0, LRP_1];
  var osmDataBase = new _MapDataBase["default"]();
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          _OSMIntegration["default"].initMapDataBase(osmDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          var decoded = _LineDecoder["default"].decode(osmDataBase, LRPs, 0, 0, decoderProperties);

          expect(decoded.lines[0].getID()).toEqual("51356773_28929726_1");
          expect(decoded.lines[1].getID()).toEqual("4579317_28929725_1");
          expect(decoded.posOffset).toEqual(57);
          expect(decoded.negOffset).toEqual(113);
          done();
        });
      });
    });
  });
});
test('osm integration findCandidatesOrProjections 35 dist', function (done) {
  expect.assertions(19);
  var decoderProperties = {
    dist: 35,
    //maximum distance of a candidate node to a LRP
    bearDiff: 60,
    //maximum difference between the bearing of a candidate node and that of a LRP
    frcDiff: 3,
    //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 2,
    //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 100,
    //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: false,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
  };
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID5 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID5.nodes,
      lines = _mapNodesLinesToID5.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.doubleLineLane.locationLines;

  var LRPs = _LineEncoder["default"].encode(mapDataBase, locLines, 0, 0);

  var osmDataBase = new _MapDataBase["default"]();
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          _OSMIntegration["default"].initMapDataBase(osmDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          expect(osmDataBase.nodes[28929726].getLatitudeDeg()).toEqual(51.2120497);
          expect(osmDataBase.nodes[28929726].getLongitudeDeg()).toEqual(4.3971693);
          expect(osmDataBase).toBeDefined();

          var candidateNodes = _LineDecoder["default"].findCandidatesOrProjections(osmDataBase, LRPs.LRPs, decoderProperties); // the first LRP should have a real node, the second LRP should have two projected points


          expect(candidateNodes[0].length).toEqual(2);
          expect(candidateNodes[0][0].node).toBeDefined();
          expect(candidateNodes[0][0].node.id).toEqual("28929726");
          expect(candidateNodes[0][0].node.lat).toEqual(51.2120497);
          expect(candidateNodes[0][0].node["long"]).toEqual(4.3971693);
          expect(candidateNodes[0][1].node).toBeDefined();
          expect(candidateNodes[0][1].node.id).toEqual("5917934406");
          expect(candidateNodes[0][1].node.lat).toEqual(51.2118663);
          expect(candidateNodes[0][1].node["long"]).toEqual(4.3971962);
          expect(candidateNodes[1].length).toEqual(2);
          expect(candidateNodes[1][0].node).toBeUndefined();
          expect(candidateNodes[1][0].line).toBeDefined();
          expect(candidateNodes[1][0].line.getID()).toEqual("4579317_28929725_1");
          expect(candidateNodes[1][1].node).toBeUndefined();
          expect(candidateNodes[1][1].line).toBeDefined();
          expect(candidateNodes[1][1].line.getID()).toEqual("4579317_28929725");
          done();
        });
      });
    });
  });
});
test('osm integration findCandidatesOrProjections 50 dist', function (done) {
  expect.assertions(21);
  var decoderProperties = {
    dist: 50,
    //maximum distance of a candidate node to a LRP
    bearDiff: 60,
    //maximum difference between the bearing of a candidate node and that of a LRP
    frcDiff: 3,
    //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 2,
    //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 100,
    //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: false,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
  };
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID6 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID6.nodes,
      lines = _mapNodesLinesToID6.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.doubleLineLane.locationLines;

  var LRPs = _LineEncoder["default"].encode(mapDataBase, locLines, 0, 0);

  var osmDataBase = new _MapDataBase["default"]();
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          _OSMIntegration["default"].initMapDataBase(osmDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          expect(osmDataBase.nodes[28929726].getLatitudeDeg()).toEqual(51.2120497);
          expect(osmDataBase.nodes[28929726].getLongitudeDeg()).toEqual(4.3971693);
          expect(osmDataBase).toBeDefined();

          var candidateNodes = _LineDecoder["default"].findCandidatesOrProjections(osmDataBase, LRPs.LRPs, decoderProperties); // the first LRP should have a real node, the second LRP should have two projected points


          expect(candidateNodes[0].length).toEqual(2);
          expect(candidateNodes[0][0].node).toBeDefined();
          expect(candidateNodes[0][0].node.id).toEqual("28929726");
          expect(candidateNodes[0][0].node.lat).toEqual(51.2120497);
          expect(candidateNodes[0][0].node["long"]).toEqual(4.3971693);
          expect(candidateNodes[0][1].node).toBeDefined();
          expect(candidateNodes[0][1].node.id).toEqual("5917934406");
          expect(candidateNodes[0][1].node.lat).toEqual(51.2118663);
          expect(candidateNodes[0][1].node["long"]).toEqual(4.3971962);
          expect(candidateNodes[1].length).toEqual(2);
          expect(candidateNodes[1][0].node).toBeDefined();
          expect(candidateNodes[1][0].node.id).toEqual("28929726");
          expect(candidateNodes[1][0].node.lat).toEqual(51.2120497);
          expect(candidateNodes[1][0].node["long"]).toEqual(4.3971693);
          expect(candidateNodes[1][1].node).toBeDefined();
          expect(candidateNodes[1][1].node.id).toEqual("5917934406");
          expect(candidateNodes[1][1].node.lat).toEqual(51.2118663);
          expect(candidateNodes[1][1].node["long"]).toEqual(4.3971962);
          done();
        });
      });
    });
  });
});
test('osm integration findCandidatesOrProjections 50 dist always project', function (done) {
  expect.assertions(33);
  var decoderProperties = {
    dist: 50,
    //maximum distance of a candidate node to a LRP
    bearDiff: 60,
    //maximum difference between the bearing of a candidate node and that of a LRP
    frcDiff: 3,
    //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 2,
    //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 100,
    //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: true,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
  };
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID7 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID7.nodes,
      lines = _mapNodesLinesToID7.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.doubleLineLane.locationLines;

  var LRPs = _LineEncoder["default"].encode(mapDataBase, locLines, 0, 0);

  var osmDataBase = new _MapDataBase["default"]();
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          _OSMIntegration["default"].initMapDataBase(osmDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          expect(osmDataBase.nodes[28929726].getLatitudeDeg()).toEqual(51.2120497);
          expect(osmDataBase.nodes[28929726].getLongitudeDeg()).toEqual(4.3971693);
          expect(osmDataBase).toBeDefined();

          var candidateNodes = _LineDecoder["default"].findCandidatesOrProjections(osmDataBase, LRPs.LRPs, decoderProperties);

          expect(candidateNodes[0].length).toEqual(8);
          expect(candidateNodes[0][0].node).toBeDefined();
          expect(candidateNodes[0][0].node.id).toEqual("28929726");
          expect(candidateNodes[0][0].node.lat).toEqual(51.2120497);
          expect(candidateNodes[0][0].node["long"]).toEqual(4.3971693);
          expect(candidateNodes[0][1].node).toBeDefined();
          expect(candidateNodes[0][1].node.id).toEqual("5917934406");
          expect(candidateNodes[0][1].node.lat).toEqual(51.2118663);
          expect(candidateNodes[0][1].node["long"]).toEqual(4.3971962);
          expect(candidateNodes[0][5].node).toBeUndefined();
          expect(candidateNodes[0][5].line).toBeDefined();
          expect(candidateNodes[0][5].line.getID()).toEqual("4579317_28929725_1");
          expect(candidateNodes[0][6].node).toBeUndefined();
          expect(candidateNodes[0][6].line).toBeDefined();
          expect(candidateNodes[0][6].line.getID()).toEqual("4579317_28929725");
          expect(candidateNodes[1].length).toEqual(8);
          expect(candidateNodes[1][0].node).toBeDefined();
          expect(candidateNodes[1][0].node.id).toEqual("28929726");
          expect(candidateNodes[1][0].node.lat).toEqual(51.2120497);
          expect(candidateNodes[1][0].node["long"]).toEqual(4.3971693);
          expect(candidateNodes[1][1].node).toBeDefined();
          expect(candidateNodes[1][1].node.id).toEqual("5917934406");
          expect(candidateNodes[1][1].node.lat).toEqual(51.2118663);
          expect(candidateNodes[1][1].node["long"]).toEqual(4.3971962);
          expect(candidateNodes[1][5].node).toBeUndefined();
          expect(candidateNodes[1][5].line).toBeDefined();
          expect(candidateNodes[1][5].line.getID()).toEqual("4579317_28929725_1");
          expect(candidateNodes[1][6].node).toBeUndefined();
          expect(candidateNodes[1][6].line).toBeDefined();
          expect(candidateNodes[1][6].line.getID()).toEqual("4579317_28929725");
          done();
        });
      });
    });
  });
});
test('osm integration findCandidateLines', function (done) {
  expect.assertions(5);
  var decoderProperties = {
    dist: 35,
    //maximum distance of a candidate node to a LRP
    bearDiff: 60,
    //maximum difference between the bearing of a candidate node and that of a LRP
    frcDiff: 3,
    //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 2,
    //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 100,
    //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: false,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
  };
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID8 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID8.nodes,
      lines = _mapNodesLinesToID8.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.doubleLineLane.locationLines;

  var LRPs = _LineEncoder["default"].encode(mapDataBase, locLines, 0, 0);

  var osmDataBase = new _MapDataBase["default"]();
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          _OSMIntegration["default"].initMapDataBase(osmDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          var candidateNodes = _LineDecoder["default"].findCandidatesOrProjections(osmDataBase, LRPs.LRPs, decoderProperties);

          var candidateLines = _LineDecoder["default"].findCandidateLines(LRPs.LRPs, candidateNodes, decoderProperties); //the first LRP had a real candidate node, which should be the start node of the found line,
          //the second LRP had 2 projected candidate nodes, of which only one's line has the right direction


          expect(candidateLines[0].length).toEqual(1);
          expect(candidateLines[0][0].line.getStartNode().getID()).toEqual("28929726");
          expect(candidateLines[0][0].line.getID()).toEqual("4579317_28929725_1");
          expect(candidateLines[1].length).toEqual(1);
          expect(candidateLines[1][0].line.getID()).toEqual("4579317_28929725_1");
          done();
        });
      });
    });
  });
});
test('osm integration findCandidateLines 50 dist', function (done) {
  expect.assertions(6);
  var decoderProperties = {
    dist: 50,
    //maximum distance of a candidate node to a LRP
    bearDiff: 60,
    //maximum difference between the bearing of a candidate node and that of a LRP
    frcDiff: 3,
    //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 2,
    //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 100,
    //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: false,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
  };
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID9 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID9.nodes,
      lines = _mapNodesLinesToID9.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.doubleLineLane.locationLines;

  var LRPs = _LineEncoder["default"].encode(mapDataBase, locLines, 0, 0);

  var osmDataBase = new _MapDataBase["default"]();
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          _OSMIntegration["default"].initMapDataBase(osmDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          var candidateNodes = _LineDecoder["default"].findCandidatesOrProjections(osmDataBase, LRPs.LRPs, decoderProperties);

          var candidateLines = _LineDecoder["default"].findCandidateLines(LRPs.LRPs, candidateNodes, decoderProperties);

          expect(candidateLines[0].length).toEqual(1);
          expect(candidateLines[0][0].line.getStartNode().getID()).toEqual("28929726");
          expect(candidateLines[0][0].line.getID()).toEqual("4579317_28929725_1");
          expect(candidateLines[1].length).toEqual(2);
          expect(candidateLines[1][0].line.getID()).toEqual("211184913_28929726_1");
          expect(candidateLines[1][1].line.getID()).toEqual("51356773_28929726_1");
          done();
        });
      });
    });
  });
});
test('osm integration findCandidateLines 50 dist always project', function (done) {
  expect.assertions(14);
  var decoderProperties = {
    dist: 50,
    //maximum distance of a candidate node to a LRP
    bearDiff: 60,
    //maximum difference between the bearing of a candidate node and that of a LRP
    frcDiff: 3,
    //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 2,
    //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 100,
    //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: true,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
  };
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID10 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID10.nodes,
      lines = _mapNodesLinesToID10.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.doubleLineLane.locationLines;

  var LRPs = _LineEncoder["default"].encode(mapDataBase, locLines, 0, 0);

  var osmDataBase = new _MapDataBase["default"]();
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          _OSMIntegration["default"].initMapDataBase(osmDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          var candidateNodes = _LineDecoder["default"].findCandidatesOrProjections(osmDataBase, LRPs.LRPs, decoderProperties);

          var candidateLines = _LineDecoder["default"].findCandidateLines(LRPs.LRPs, candidateNodes, decoderProperties);

          expect(candidateLines[0].length).toEqual(2);
          expect(candidateLines[0][0].line.getID()).toEqual("4579317_28929725_1");
          expect(candidateLines[0][0].projected).toEqual(true);
          expect(candidateLines[0][1].line.getID()).toEqual("4579317_28929725_1");
          expect(candidateLines[0][1].projected).toEqual(false);
          expect(candidateLines[1].length).toEqual(4);
          expect(candidateLines[1][0].line.getID()).toEqual("4579317_28929725_1");
          expect(candidateLines[1][0].projected).toEqual(true);
          expect(candidateLines[1][1].line.getID()).toEqual("211184913_28929726_1");
          expect(candidateLines[1][1].projected).toEqual(false);
          expect(candidateLines[1][2].line.getID()).toEqual("51356773_28929726_1");
          expect(candidateLines[1][2].projected).toEqual(false);
          expect(candidateLines[1][3].line.getID()).toEqual("7940936_28929726");
          expect(candidateLines[1][3].projected).toEqual(true);
          done();
        });
      });
    });
  });
});
test('osm integration determineShortestPaths', function (done) {
  expect.assertions(4);
  var decoderProperties = {
    dist: 35,
    //maximum distance of a candidate node to a LRP
    bearDiff: 60,
    //maximum difference between the bearing of a candidate node and that of a LRP
    frcDiff: 3,
    //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 2,
    //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 100,
    //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: false,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
  };
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID11 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID11.nodes,
      lines = _mapNodesLinesToID11.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.doubleLineLane.locationLines;

  var LRPs = _LineEncoder["default"].encode(mapDataBase, locLines, 0, 0);

  var osmDataBase = new _MapDataBase["default"]();
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          _OSMIntegration["default"].initMapDataBase(osmDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          var candidateNodes = _LineDecoder["default"].findCandidatesOrProjections(osmDataBase, LRPs.LRPs, decoderProperties);

          var candidateLines = _LineDecoder["default"].findCandidateLines(LRPs.LRPs, candidateNodes, decoderProperties);

          var concatShortestPath = _LineDecoder["default"].determineShortestPaths(candidateLines, LRPs.LRPs, decoderProperties);

          expect(concatShortestPath.shortestPath.length).toEqual(1);
          expect(concatShortestPath.shortestPath[0].getID()).toEqual("4579317_28929725_1");
          expect(concatShortestPath.posProjDist).toEqual(0);
          expect(concatShortestPath.negProjDist).toEqual(osmDataBase.lines["4579317_28929725_1"].getLength() - 4030);
          done();
        });
      });
    });
  });
});
test('osm integration determineShortestPaths 50 dist', function (done) {
  expect.assertions(1);
  var decoderProperties = {
    dist: 50,
    //maximum distance of a candidate node to a LRP
    bearDiff: 60,
    //maximum difference between the bearing of a candidate node and that of a LRP
    frcDiff: 3,
    //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 2,
    //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 100,
    //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: false,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
  };
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID12 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID12.nodes,
      lines = _mapNodesLinesToID12.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.doubleLineLane.locationLines;

  var LRPs = _LineEncoder["default"].encode(mapDataBase, locLines, 0, 0);

  var osmDataBase = new _MapDataBase["default"]();
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          _OSMIntegration["default"].initMapDataBase(osmDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          var candidateNodes = _LineDecoder["default"].findCandidatesOrProjections(osmDataBase, LRPs.LRPs, decoderProperties);

          var candidateLines = _LineDecoder["default"].findCandidateLines(LRPs.LRPs, candidateNodes, decoderProperties);

          expect(function () {
            _LineDecoder["default"].determineShortestPaths(candidateLines, LRPs.LRPs, decoderProperties);
          }).toThrow(Error("No shortest path could be found between the given LRPs with indexes 0 and 1" + " You either tried to decode a loop that isn't present in the current map " + "or you tried decoding a line between two points that are to close together and decoded as a single node"));
          done();
        });
      });
    });
  });
});
test('osm integration determineShortestPaths 50 dist always project', function (done) {
  expect.assertions(4);
  var decoderProperties = {
    dist: 50,
    //maximum distance of a candidate node to a LRP
    bearDiff: 60,
    //maximum difference between the bearing of a candidate node and that of a LRP
    frcDiff: 3,
    //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 2,
    //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 100,
    //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: true,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
  };
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID13 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID13.nodes,
      lines = _mapNodesLinesToID13.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.doubleLineLane.locationLines;

  var LRPs = _LineEncoder["default"].encode(mapDataBase, locLines, 0, 0);

  var osmDataBase = new _MapDataBase["default"]();
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          _OSMIntegration["default"].initMapDataBase(osmDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          var candidateNodes = _LineDecoder["default"].findCandidatesOrProjections(osmDataBase, LRPs.LRPs, decoderProperties);

          var candidateLines = _LineDecoder["default"].findCandidateLines(LRPs.LRPs, candidateNodes, decoderProperties);

          var concatShortestPath = _LineDecoder["default"].determineShortestPaths(candidateLines, LRPs.LRPs, decoderProperties);

          expect(concatShortestPath.shortestPath.length).toEqual(1);
          expect(concatShortestPath.shortestPath[0].getID()).toEqual("4579317_28929725_1");
          expect(concatShortestPath.posProjDist).toEqual(2074); // if alwaysUseProjections = true, the first LRP is also projected

          expect(concatShortestPath.negProjDist).toEqual(osmDataBase.lines["4579317_28929725_1"].getLength() - 4030);
          done();
        });
      });
    });
  });
});
test('osm integration trimAccordingToOffsets no offsets', function (done) {
  expect.assertions(6);
  var decoderProperties = {
    dist: 35,
    //maximum distance of a candidate node to a LRP
    bearDiff: 60,
    //maximum difference between the bearing of a candidate node and that of a LRP
    frcDiff: 3,
    //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 2,
    //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 100,
    //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: false,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
  };
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID14 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID14.nodes,
      lines = _mapNodesLinesToID14.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.doubleLineLane.locationLines;

  var LRPs = _LineEncoder["default"].encode(mapDataBase, locLines, 0, 0);

  var osmDataBase = new _MapDataBase["default"]();
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          _OSMIntegration["default"].initMapDataBase(osmDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          var candidateNodes = _LineDecoder["default"].findCandidatesOrProjections(osmDataBase, LRPs.LRPs, decoderProperties);

          var candidateLines = _LineDecoder["default"].findCandidateLines(LRPs.LRPs, candidateNodes, decoderProperties);

          var concatShortestPath = _LineDecoder["default"].determineShortestPaths(candidateLines, LRPs.LRPs, decoderProperties);

          var offsets = {
            posOffset: 0,
            negOffset: 0
          };

          _LineDecoder["default"].trimAccordingToOffsets(concatShortestPath, offsets);

          expect(concatShortestPath.shortestPath.length).toEqual(1);
          expect(concatShortestPath.shortestPath[0].getID()).toEqual("4579317_28929725_1");
          expect(concatShortestPath.posProjDist).toEqual(0);
          expect(concatShortestPath.negProjDist).toEqual(osmDataBase.lines["4579317_28929725_1"].getLength() - 4030);
          expect(offsets.posOffset).toEqual(0);
          expect(offsets.negOffset).toEqual(osmDataBase.lines["4579317_28929725_1"].getLength() - 4030);
          done();
        });
      });
    });
  });
});
test('osm integration trimAccordingToOffsets with invalid offsets', function (done) {
  expect.assertions(6);
  var decoderProperties = {
    dist: 35,
    //maximum distance of a candidate node to a LRP
    bearDiff: 60,
    //maximum difference between the bearing of a candidate node and that of a LRP
    frcDiff: 3,
    //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 2,
    //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 100,
    //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: false,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
  };
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID15 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID15.nodes,
      lines = _mapNodesLinesToID15.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.doubleLineLane.locationLines;

  var LRPs = _LineEncoder["default"].encode(mapDataBase, locLines, 0, 0);

  var osmDataBase = new _MapDataBase["default"]();
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          _OSMIntegration["default"].initMapDataBase(osmDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          var candidateNodes = _LineDecoder["default"].findCandidatesOrProjections(osmDataBase, LRPs.LRPs, decoderProperties);

          var candidateLines = _LineDecoder["default"].findCandidateLines(LRPs.LRPs, candidateNodes, decoderProperties);

          var concatShortestPath = _LineDecoder["default"].determineShortestPaths(candidateLines, LRPs.LRPs, decoderProperties);

          var offsets = {
            posOffset: 0,
            negOffset: 12000
          };

          _LineDecoder["default"].trimAccordingToOffsets(concatShortestPath, offsets);

          expect(concatShortestPath.shortestPath.length).toEqual(1);
          expect(concatShortestPath.shortestPath[0].getID()).toEqual("4579317_28929725_1");
          expect(concatShortestPath.posProjDist).toEqual(0);
          expect(concatShortestPath.negProjDist).toEqual(osmDataBase.lines["4579317_28929725_1"].getLength() - 4030);
          expect(offsets.posOffset).toEqual(0);
          expect(offsets.negOffset).toEqual(osmDataBase.lines["4579317_28929725_1"].getLength() - 4030 + 12000);
          done();
        });
      });
    });
  });
});
test('osm integration trimAccordingToOffsets valid offsets', function (done) {
  expect.assertions(6);
  var decoderProperties = {
    dist: 35,
    //maximum distance of a candidate node to a LRP
    bearDiff: 60,
    //maximum difference between the bearing of a candidate node and that of a LRP
    frcDiff: 3,
    //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 2,
    //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 100,
    //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: false,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
  };
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID16 = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID16.nodes,
      lines = _mapNodesLinesToID16.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  var locLines = startData.doubleLineLane.locationLines;

  var LRPs = _LineEncoder["default"].encode(mapDataBase, locLines, 0, 0);

  var osmDataBase = new _MapDataBase["default"]();
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          _OSMIntegration["default"].initMapDataBase(osmDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          var candidateNodes = _LineDecoder["default"].findCandidatesOrProjections(osmDataBase, LRPs.LRPs, decoderProperties);

          var candidateLines = _LineDecoder["default"].findCandidateLines(LRPs.LRPs, candidateNodes, decoderProperties);

          var concatShortestPath = _LineDecoder["default"].determineShortestPaths(candidateLines, LRPs.LRPs, decoderProperties);

          var offsets = {
            posOffset: 500,
            negOffset: 700
          };

          _LineDecoder["default"].trimAccordingToOffsets(concatShortestPath, offsets);

          expect(concatShortestPath.shortestPath.length).toEqual(1);
          expect(concatShortestPath.shortestPath[0].getID()).toEqual("4579317_28929725_1");
          expect(concatShortestPath.posProjDist).toEqual(0);
          expect(concatShortestPath.negProjDist).toEqual(osmDataBase.lines["4579317_28929725_1"].getLength() - 4030);
          expect(offsets.posOffset).toEqual(500);
          expect(offsets.negOffset).toEqual(osmDataBase.lines["4579317_28929725_1"].getLength() - 4030 + 700);
          done();
        });
      });
    });
  });
});