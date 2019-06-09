"use strict";

var _MapDataBase = _interopRequireDefault(require("../map/MapDataBase"));

var _SlowMapDataBase = _interopRequireDefault(require("../map/SlowMapDataBase"));

var _Helperfunctions = require("./Helperfunctions");

var _LoadData = require("../../Data/LoadData");

var _WegenregisterAntwerpenIntegration = _interopRequireDefault(require("../../OpenLRIntegration/WegenregisterAntwerpenIntegration"));

var _ParseData = require("../../Data/ParseData");

var _OSMIntegration = _interopRequireDefault(require("../../OpenLRIntegration/OSMIntegration"));

var _LoadTestData = require("../../Data/LoadTestData");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @jest-environment node
 */
test('initialize mapdatabase', function () {
  var startData = (0, _Helperfunctions.generateStraightLaneTestData)();

  var _mapNodesLinesToID = (0, _Helperfunctions.mapNodesLinesToID)(startData.nodes, startData.lines),
      nodes = _mapNodesLinesToID.nodes,
      lines = _mapNodesLinesToID.lines;

  var mapDataBase = new _MapDataBase["default"](lines, nodes);
  expect(mapDataBase.getAllLines().length).toEqual(lines.length);
  expect(mapDataBase.getAllNodes().length).toEqual(nodes.length);
  expect(mapDataBase.getNumberOfLines()).toEqual(lines.length);
  expect(mapDataBase.getNumberOfNodes()).toEqual(nodes.length);
  expect(mapDataBase.hasTurnRestrictions()).toEqual(false);
});
test.skip('findNodesCloseByCoordinate use with a lot of nodes (from wegenregister Antwerpen)', function (done) {
  expect.assertions(19);
  (0, _LoadData.loadNodesLineStringsWegenregisterAntwerpen)().then(function (features) {
    var slowMapDataBase = new _SlowMapDataBase["default"]();
    var mapDataBase = new _MapDataBase["default"]();

    _WegenregisterAntwerpenIntegration["default"].initMapDataBase(slowMapDataBase, features);

    _WegenregisterAntwerpenIntegration["default"].initMapDataBase(mapDataBase, features);

    expect(mapDataBase).toBeDefined();
    var foundNodes = mapDataBase.findNodesCloseByCoordinate(51.2120497, 4.3971693, 5000);
    expect(slowMapDataBase).toBeDefined();
    var foundNodesSlow = slowMapDataBase.findNodesCloseByCoordinate(51.2120497, 4.3971693, 5000);
    expect(foundNodes.length).not.toEqual(0);
    expect(foundNodesSlow.length).not.toEqual(0);
    expect(foundNodes.length).toEqual(foundNodesSlow.length);
    var found = {};
    foundNodesSlow.forEach(function (node) {
      found[node.node.getID()] = true;
    });
    foundNodes.forEach(function (node) {
      expect(found[node.node.getID()]).toEqual(true);
    });
    done();
  });
}, 60000);
test.skip('findLinesCloseByCoordinate use with a lot of lines (from wegenregister Antwerpen)', function (done) {
  expect.assertions(41);
  (0, _LoadData.loadNodesLineStringsWegenregisterAntwerpen)().then(function (features) {
    var slowMapDataBase = new _SlowMapDataBase["default"]();
    var mapDataBase = new _MapDataBase["default"]();

    _WegenregisterAntwerpenIntegration["default"].initMapDataBase(slowMapDataBase, features);

    _WegenregisterAntwerpenIntegration["default"].initMapDataBase(mapDataBase, features);

    expect(mapDataBase).toBeDefined();
    var foundLines = mapDataBase.findLinesCloseByCoordinate(51.2120497, 4.3971693, 5000);
    expect(slowMapDataBase).toBeDefined();
    var foundLinesSlow = slowMapDataBase.findLinesCloseByCoordinate(51.2120497, 4.3971693, 5000);
    expect(foundLines.length).not.toEqual(0);
    expect(foundLinesSlow.length).not.toEqual(0);
    expect(foundLines.length).toEqual(foundLinesSlow.length);
    var found = {};
    foundLinesSlow.forEach(function (line) {
      found[line.line.getID()] = true;
    });
    foundLines.forEach(function (line) {
      expect(found[line.line.getID()]).toEqual(true);
    });
    done();
  });
}, 60000);
test('findNodesCloseByCoordinate OSM data', function (done) {
  expect.assertions(7);
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          var slowMapDataBase = new _SlowMapDataBase["default"]();
          var mapDataBase = new _MapDataBase["default"]();

          _OSMIntegration["default"].initMapDataBase(mapDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          _OSMIntegration["default"].initMapDataBase(slowMapDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          expect(mapDataBase).toBeDefined();
          var foundNodes = mapDataBase.findNodesCloseByCoordinate(51.2120497, 4.3971693, 5000);
          expect(slowMapDataBase).toBeDefined();
          var foundNodesSlow = slowMapDataBase.findNodesCloseByCoordinate(51.2120497, 4.3971693, 5000);
          expect(foundNodes.length).not.toEqual(0);
          expect(foundNodesSlow.length).not.toEqual(0);
          expect(foundNodes.length).toEqual(foundNodesSlow.length);
          var found = {};
          foundNodesSlow.forEach(function (node) {
            found[node.node.getID()] = true;
          });
          foundNodes.forEach(function (node) {
            expect(found[node.node.getID()]).toEqual(true);
          });
          done();
        });
      });
    });
  });
});
test('findLinesCloseByCoordinate OSM data', function (done) {
  expect.assertions(17);
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          var slowMapDataBase = new _SlowMapDataBase["default"]();
          var mapDataBase = new _MapDataBase["default"]();

          _OSMIntegration["default"].initMapDataBase(mapDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          _OSMIntegration["default"].initMapDataBase(slowMapDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          expect(mapDataBase).toBeDefined();
          var foundLines = mapDataBase.findLinesCloseByCoordinate(51.2120497, 4.3971693, 5000);
          expect(slowMapDataBase).toBeDefined();
          var foundLinesSlow = slowMapDataBase.findLinesCloseByCoordinate(51.2120497, 4.3971693, 5000);
          expect(foundLines.length).not.toEqual(0);
          expect(foundLinesSlow.length).not.toEqual(0);
          expect(foundLines.length).toEqual(foundLinesSlow.length);
          var found = {};
          foundLinesSlow.forEach(function (line) {
            found[line.line.getID()] = true;
          });
          foundLines.forEach(function (line) {
            expect(found[line.line.getID()]).toEqual(true);
          });
          done();
        });
      });
    });
  });
});
test('findNodesCloseByCoordinate OSM data 2', function (done) {
  expect.assertions(7);
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          var slowMapDataBase = new _SlowMapDataBase["default"]();
          var mapDataBase = new _MapDataBase["default"]();

          _OSMIntegration["default"].initMapDataBase(mapDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          _OSMIntegration["default"].initMapDataBase(slowMapDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          expect(mapDataBase).toBeDefined();
          var foundNodes = mapDataBase.findNodesCloseByCoordinate(51.2120361, 4.3974671, 5000);
          expect(slowMapDataBase).toBeDefined();
          var foundNodesSlow = slowMapDataBase.findNodesCloseByCoordinate(51.2120361, 4.3974671, 5000);
          expect(foundNodes.length).not.toEqual(0);
          expect(foundNodesSlow.length).not.toEqual(0);
          expect(foundNodes.length).toEqual(foundNodesSlow.length);
          var found = {};
          foundNodesSlow.forEach(function (node) {
            found[node.node.getID()] = true;
          });
          foundNodes.forEach(function (node) {
            expect(found[node.node.getID()]).toEqual(true);
          });
          done();
        });
      });
    });
  });
});
test('findLinesCloseByCoordinate OSM data 2', function (done) {
  expect.assertions(17);
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          var slowMapDataBase = new _SlowMapDataBase["default"]();
          var mapDataBase = new _MapDataBase["default"]();

          _OSMIntegration["default"].initMapDataBase(mapDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          _OSMIntegration["default"].initMapDataBase(slowMapDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          expect(mapDataBase).toBeDefined();
          var foundLines = mapDataBase.findLinesCloseByCoordinate(51.2120361, 4.3974671, 5000);
          expect(slowMapDataBase).toBeDefined();
          var foundLinesSlow = slowMapDataBase.findLinesCloseByCoordinate(51.2120361, 4.3974671, 5000);
          expect(foundLines.length).not.toEqual(0);
          expect(foundLinesSlow.length).not.toEqual(0);
          expect(foundLines.length).toEqual(foundLinesSlow.length);
          var found = {};
          foundLinesSlow.forEach(function (line) {
            found[line.line.getID()] = true;
          });
          foundLines.forEach(function (line) {
            expect(found[line.line.getID()]).toEqual(true);
          });
          done();
        });
      });
    });
  });
});
test('findNodesCloseByCoordinate OSM data 3', function (done) {
  expect.assertions(7);
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          var slowMapDataBase = new _SlowMapDataBase["default"]();
          var mapDataBase = new _MapDataBase["default"]();

          _OSMIntegration["default"].initMapDataBase(mapDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          _OSMIntegration["default"].initMapDataBaseDeprecatedNoOneWay(slowMapDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          expect(mapDataBase).toBeDefined();
          var foundNodes = mapDataBase.findNodesCloseByCoordinate(51.2120361, 4.3974671, 5000);
          expect(slowMapDataBase).toBeDefined();
          var foundNodesSlow = slowMapDataBase.findNodesCloseByCoordinate(51.2120361, 4.3974671, 5000);
          expect(foundNodes.length).not.toEqual(0);
          expect(foundNodesSlow.length).not.toEqual(0);
          expect(foundNodes.length).toEqual(foundNodesSlow.length);
          var found = {};
          foundNodesSlow.forEach(function (node) {
            found[node.node.getID()] = true;
          });
          foundNodes.forEach(function (node) {
            expect(found[node.node.getID()]).toEqual(true);
          });
          done();
        });
      });
    });
  });
});
test('findLinesCloseByCoordinate OSM data 3', function (done) {
  expect.assertions(17);
  (0, _LoadTestData.loadOsmTestData)().then(function (data) {
    (0, _ParseData.parseToJson)(data).then(function (json) {
      (0, _ParseData.getMappedElements)(json).then(function (elements) {
        (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
          var slowMapDataBase = new _SlowMapDataBase["default"]();
          var mapDataBase = new _MapDataBase["default"]();

          _OSMIntegration["default"].initMapDataBase(mapDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          _OSMIntegration["default"].initMapDataBaseDeprecatedNoOneWay(slowMapDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

          expect(mapDataBase).toBeDefined();
          var foundLines = mapDataBase.findLinesCloseByCoordinate(51.2120361, 4.3974671, 5000);
          expect(slowMapDataBase).toBeDefined();
          var foundLinesSlow = slowMapDataBase.findLinesCloseByCoordinate(51.2120361, 4.3974671, 5000);
          expect(foundLines.length).not.toEqual(0);
          expect(foundLinesSlow.length).not.toEqual(0);
          expect(foundLines.length).toEqual(foundLinesSlow.length);
          var found = {};
          foundLinesSlow.forEach(function (line) {
            found[line.line.getID()] = true;
          });
          foundLines.forEach(function (line) {
            expect(found[line.line.getID()]).toEqual(true);
          });
          done();
        });
      });
    });
  });
});