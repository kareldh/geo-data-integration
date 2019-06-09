"use strict";

var _LoadData = require("../Data/LoadData");

var _MapDataBase = _interopRequireDefault(require("../OpenLR/map/MapDataBase"));

var _WegenregisterAntwerpenIntegration = _interopRequireDefault(require("../OpenLRIntegration/WegenregisterAntwerpenIntegration"));

var _ParseData = require("../Data/ParseData");

var _RoutableTilesIntegration = _interopRequireDefault(require("../OpenLRIntegration/RoutableTilesIntegration"));

var _CoderSettings = require("../OpenLR/coder/CoderSettings");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @jest-environment node
 */
test.skip('density wegenregister', function (done) {
  (0, _LoadData.loadNodesLineStringsWegenregisterAntwerpen)().then(function (features) {
    var mapDatabase = new _MapDataBase["default"]();

    _WegenregisterAntwerpenIntegration["default"].initMapDataBase(mapDatabase, features);

    var lines = mapDatabase.findLinesCloseByCoordinate(51.2120497, 4.3971693, 500 * _CoderSettings.configProperties.internalPrecision);
    var nodes = mapDatabase.findNodesCloseByCoordinate(51.2120497, 4.3971693, 500 * _CoderSettings.configProperties.internalPrecision);
    console.log("Nodes:", nodes.length, "Lines:", lines.length);
    expect(lines).toBeDefined();
    expect(nodes).toBeDefined();
    done();
  });
});
test.skip('density routable tiles', function (done) {
  (0, _LoadData.fetchRoutableTile)(14, 8392, 5469).then(function (data) {
    (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
      var mapDatabase = new _MapDataBase["default"]();

      _RoutableTilesIntegration["default"].initMapDataBase(mapDatabase, nodesAndLines.nodes, nodesAndLines.lines);

      var lines = mapDatabase.findLinesCloseByCoordinate(51.2120497, 4.3971693, 500 * _CoderSettings.configProperties.internalPrecision);
      var nodes = mapDatabase.findNodesCloseByCoordinate(51.2120497, 4.3971693, 500 * _CoderSettings.configProperties.internalPrecision);
      console.log("Nodes:", nodes.length, "Lines:", lines.length);
      expect(lines).toBeDefined();
      expect(nodes).toBeDefined();
      done();
    });
  });
});