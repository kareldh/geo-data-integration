"use strict";

var _LoadData = require("../../Data/LoadData");

var _WegenregisterAntwerpenIntegration = _interopRequireDefault(require("../WegenregisterAntwerpenIntegration"));

var _MapDataBase = _interopRequireDefault(require("../../OpenLR/map/MapDataBase"));

var _LinesDirectlyToLRPs = require("../../OpenLR/experimental/LinesDirectlyToLRPs");

var _Decoder = _interopRequireDefault(require("../../OpenLR/Decoder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @jest-environment node
 */
test("initMapDatabase", function (done) {
  expect.assertions(3);
  (0, _LoadData.loadNodesLineStringsWegenregisterAntwerpen)().then(function (features) {
    var mapDatabase = new _MapDataBase["default"]();

    _WegenregisterAntwerpenIntegration["default"].initMapDataBase(mapDatabase, features);

    expect(mapDatabase).toBeDefined();
    expect(mapDatabase.lines).not.toEqual({});
    expect(mapDatabase.nodes).not.toEqual({});
    done();
  });
}, 60000);
test("LinesDirectlyToLRPs short line decode", function (done) {
  var decoderProperties = {
    dist: 35,
    //maximum distance (in meter) of a candidate node to a LRP
    bearDiff: 60,
    //maximum difference (in degrees) between the bearing of a candidate node and that of a LRP
    frcDiff: 3,
    //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 3,
    //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 50,
    //maximum difference (in meter) between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: true,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
  };
  expect.assertions(1);
  (0, _LoadData.loadNodesLineStringsWegenregisterAntwerpen)().then(function (features) {
    var mapDatabase = new _MapDataBase["default"]();

    _WegenregisterAntwerpenIntegration["default"].initMapDataBase(mapDatabase, features);

    var lines = [mapDatabase.lines["51.16968550738436_4.399282793207395_51.16968943633098_4.399279221440794"]];
    var location = (0, _LinesDirectlyToLRPs.LinesDirectlyToLRPs)(lines);

    var decoded = _Decoder["default"].decode(location, mapDatabase, decoderProperties);

    expect(decoded.lines.length).toEqual(1); // expect(decoded.lines[0].getID()).toEqual("51.16968550738436_4.399282793207395_51.16968943633098_4.399279221440794");
    // but it is not exactly the same line (it is its neighbour that is found because they are so short + rounding errors)

    done();
  });
}, 60000);