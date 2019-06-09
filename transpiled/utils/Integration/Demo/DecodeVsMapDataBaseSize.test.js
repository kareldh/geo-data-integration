"use strict";

var _LoadData = require("../Data/LoadData");

var _ParseData = require("../Data/ParseData");

var _MapDataBase = _interopRequireDefault(require("../OpenLR/map/MapDataBase"));

var _RoutableTilesIntegration = _interopRequireDefault(require("../OpenLRIntegration/RoutableTilesIntegration"));

var _EncodeDecodeDemoTestFunctions = require("./EncodeDecodeDemoTestFunctions");

var _LineEncoder = _interopRequireDefault(require("../OpenLR/coder/LineEncoder"));

var _LoadTestData = require("../Data/LoadTestData");

var _OSMIntegration = _interopRequireDefault(require("../OpenLRIntegration/OSMIntegration"));

var _WegenregisterAntwerpenIntegration = _interopRequireDefault(require("../OpenLRIntegration/WegenregisterAntwerpenIntegration"));

var _tileUtils = require("../../tileUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @jest-environment node
 */
//test the impact of the amount on lines in the mapdatabase vs the decoding speed
function testDecodeInTilesSame(decoderProperties, tiles) {
  return new Promise(function (resolve) {
    var mapDatabase = new _MapDataBase["default"]();
    var promises = [];
    tiles.forEach(function (tile) {
      promises.push(new Promise(function (resolve) {
        (0, _LoadData.fetchRoutableTile)(14, tile.x, tile.y).then(function (data) {
          (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
            var data = _RoutableTilesIntegration["default"].getNodesLines(nodesAndLines.nodes, nodesAndLines.lines);

            mapDatabase.addData(data.lines, data.nodes);
            resolve();
          });
        });
      }));
    });
    Promise.all(promises).then(function () {
      console.log("Database lines:", Object.keys(mapDatabase.lines).length);
      var result = (0, _EncodeDecodeDemoTestFunctions._fromOneToSame)(mapDatabase, decoderProperties, function (fromDataBase, id) {
        return _LineEncoder["default"].encode(fromDataBase, [fromDataBase.lines[id]], 0, 0);
      }, undefined, undefined, false);
      resolve(result);
    });
  });
}

function decodeInTilesSame(xAmount, yAmount) {
  return new Promise(function (resolve) {
    var tiles = [];

    for (var i = 0; i < yAmount; i++) {
      for (var j = 0; j < xAmount; j++) {
        tiles.push({
          x: 8392 - j,
          y: 5469 + i
        });
      }
    }

    testDecodeInTilesSame(_EncodeDecodeDemoTestFunctions.decoderProperties, tiles).then(function (res) {
      console.log("Amount of tiles:", xAmount * yAmount, "Mean decode time:", res.meanDecodeTime, "EncodedLines:", res.encodedLocations, "DecodedLines:", res.decodedLines);
      expect(res).toBeDefined();
      resolve();
    });
  });
}

test.skip('decode speed in function of amount of lines (amount of routable tiles) same databases', function (done) {
  expect.hasAssertions();
  decodeInTilesSame(1, 1).then(function () {
    return decodeInTilesSame(1, 10).then(function () {
      return decodeInTilesSame(2, 10).then(function () {
        return decodeInTilesSame(3, 10).then(function () {
          return decodeInTilesSame(4, 10).then(function () {
            return decodeInTilesSame(5, 10).then(function () {
              return decodeInTilesSame(6, 10).then(function () {
                return decodeInTilesSame(7, 10).then(function () {
                  return decodeInTilesSame(8, 10).then(function () {
                    return decodeInTilesSame(9, 10).then(function () {
                      return decodeInTilesSame(10, 10).then(function () {
                        return done();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}, 1800000);

function testDecodeInTilesDifferent(decoderProperties, tiles) {
  return new Promise(function (resolve) {
    var mapDatabase = new _MapDataBase["default"]();
    var promises = [];
    tiles.forEach(function (tile) {
      promises.push(new Promise(function (resolve) {
        (0, _LoadData.fetchRoutableTile)(14, tile.x, tile.y).then(function (data) {
          (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
            var data = _RoutableTilesIntegration["default"].getNodesLines(nodesAndLines.nodes, nodesAndLines.lines);

            mapDatabase.addData(data.lines, data.nodes);
            resolve();
          });
        });
      }));
    });
    var fromDatabase = new _MapDataBase["default"]();
    promises.push((0, _LoadTestData.loadOsmTestData)().then(function (data) {
      (0, _ParseData.parseToJson)(data).then(function (json) {
        (0, _ParseData.getMappedElements)(json).then(function (elements) {
          (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
            _OSMIntegration["default"].initMapDataBase(fromDatabase, highwayData.nodes, highwayData.ways, highwayData.relations);
          });
        });
      });
    }));
    Promise.all(promises).then(function () {
      console.log("Database lines:", Object.keys(mapDatabase.lines).length);
      var result = (0, _EncodeDecodeDemoTestFunctions._fromOneToOther)(fromDatabase, mapDatabase, decoderProperties, function (fromDataBase, id) {
        return _LineEncoder["default"].encode(fromDataBase, [fromDataBase.lines[id]], 0, 0);
      }, false);
      resolve(result);
    });
  });
}

function decodeInTilesDifferent(xAmount, yAmount) {
  return new Promise(function (resolve) {
    var tiles = [];

    for (var i = 0; i < yAmount; i++) {
      for (var j = 0; j < xAmount; j++) {
        tiles.push({
          x: 8392 - j,
          y: 5469 + i
        });
      }
    }

    testDecodeInTilesDifferent(_EncodeDecodeDemoTestFunctions.decoderProperties, tiles).then(function (res) {
      console.log("Amount of tiles:", xAmount * yAmount, "Mean decode time:", res.meanDecodeTime, "EncodedLines:", res.encodedLocations, "DecodedLines:", res.decodedLines);
      expect(res).toBeDefined();
      resolve();
    });
  });
}

test.skip('decode speed in function of amount of lines (amount of routable tiles) different databases', function (done) {
  expect.hasAssertions();
  decodeInTilesDifferent(1, 1).then(function () {
    return decodeInTilesDifferent(1, 10).then(function () {
      return decodeInTilesDifferent(2, 10).then(function () {
        return decodeInTilesDifferent(3, 10).then(function () {
          return decodeInTilesDifferent(4, 10).then(function () {
            return decodeInTilesDifferent(5, 10).then(function () {
              return decodeInTilesDifferent(6, 10).then(function () {
                return decodeInTilesDifferent(7, 10).then(function () {
                  return decodeInTilesDifferent(8, 10).then(function () {
                    return decodeInTilesDifferent(9, 10).then(function () {
                      return decodeInTilesDifferent(10, 10).then(function () {
                        return done();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}, 1800000);

function testDecodeInTilesSameManualCache(decoderProperties) {
  var tiles = [];

  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 5; j++) {
      tiles.push({
        x: 8392 - j,
        y: 5469 + i
      });
    }
  }

  var dataOfTiles = [];
  return new Promise(function (resolve) {
    var promises = [];
    tiles.forEach(function (tile) {
      promises.push(new Promise(function (resolve2) {
        (0, _LoadData.fetchRoutableTile)(14, tile.x, tile.y).then(function (data) {
          (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
            var data = _RoutableTilesIntegration["default"].getNodesLines(nodesAndLines.nodes, nodesAndLines.lines);

            dataOfTiles.push(data);
            resolve2();
          });
        })["catch"](function (error) {
          return console.warn(error);
        });
      }));
    });
    Promise.all(promises).then(function () {
      for (var _i = 1; _i < dataOfTiles.length; _i += 10) {
        var mapDatabase = new _MapDataBase["default"]();

        for (var _j = 0; _j < _i; _j++) {
          mapDatabase.addData(dataOfTiles[_j].lines, dataOfTiles[_j].nodes);
        }

        var result = (0, _EncodeDecodeDemoTestFunctions._fromOneToSame)(mapDatabase, decoderProperties, function (fromDataBase, id) {
          return _LineEncoder["default"].encode(fromDataBase, [fromDataBase.lines[id]], 0, 0);
        }, undefined, undefined, false);
        console.log("Database lines:", Object.keys(mapDatabase.lines).length);
        console.log("Amount of tiles:", _i, "Mean decode time:", result.meanDecodeTime, "EncodedLines:", result.encodedLocations, "DecodedLines:", result.decodedLines);
      }

      resolve();
    });
  });
}

test.skip('decode speed impact by database size manual cache same', function (done) {
  testDecodeInTilesSameManualCache(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function () {
    console.log("completed");
    done();
  });
}, 120000);

function testDecodeInTilesDiffManualCache(decoderProperties) {
  var tiles = [];

  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 6; j++) {
      tiles.push({
        x: 8392 - j,
        y: 5469 + i
      });
    }
  }

  var dataOfTiles = [];
  return new Promise(function (resolve) {
    var promises = [];
    tiles.forEach(function (tile) {
      promises.push(new Promise(function (resolve2) {
        (0, _LoadData.fetchRoutableTile)(14, tile.x, tile.y).then(function (data) {
          (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
            var data = _RoutableTilesIntegration["default"].getNodesLines(nodesAndLines.nodes, nodesAndLines.lines);

            dataOfTiles.push(data);
            resolve2();
          });
        })["catch"](function (error) {
          return console.warn(error);
        });
      }));
    });
    var fromDatabase = new _MapDataBase["default"]();
    promises.push((0, _LoadTestData.loadOsmTestData)().then(function (data) {
      (0, _ParseData.parseToJson)(data).then(function (json) {
        (0, _ParseData.getMappedElements)(json).then(function (elements) {
          (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
            _OSMIntegration["default"].initMapDataBase(fromDatabase, highwayData.nodes, highwayData.ways, highwayData.relations);
          });
        });
      });
    }));
    Promise.all(promises).then(function () {
      for (var _i2 = 1; _i2 < dataOfTiles.length; _i2 += 10) {
        var mapDatabase = new _MapDataBase["default"]();

        for (var _j2 = 0; _j2 < _i2; _j2++) {
          mapDatabase.addData(dataOfTiles[_j2].lines, dataOfTiles[_j2].nodes);
        }

        var result = (0, _EncodeDecodeDemoTestFunctions._fromOneToOther)(fromDatabase, mapDatabase, decoderProperties, function (fromDataBase, id) {
          return _LineEncoder["default"].encode(fromDataBase, [fromDataBase.lines[id]], 0, 0);
        }, false);
        console.log("Database lines:", Object.keys(mapDatabase.lines).length);
        console.log("Amount of tiles:", _i2, "Mean decode time:", result.meanDecodeTime, "EncodedLines:", result.encodedLocations, "DecodedLines:", result.decodedLines);
      }

      resolve();
    });
  });
}

test.skip('decode speed impact by database size manual cache diff', function (done) {
  testDecodeInTilesDiffManualCache(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function () {
    console.log("completed");
    done();
  });
}, 120000);
test.skip('wegenregister density', function (done) {
  (0, _LoadData.loadNodesLineStringsWegenregisterAntwerpen)().then(function (features) {
    var wegenregisterMapDataBase = new _MapDataBase["default"]();

    _WegenregisterAntwerpenIntegration["default"].initMapDataBase(wegenregisterMapDataBase, features);

    var minLat;
    var minLong;
    var maxLat;
    var maxLong;

    for (var key in wegenregisterMapDataBase.nodes) {
      if (wegenregisterMapDataBase.nodes.hasOwnProperty(key)) {
        if (minLat === undefined || wegenregisterMapDataBase.nodes[key].getLatitudeDeg() < minLat) {
          minLat = wegenregisterMapDataBase.nodes[key].getLatitudeDeg();
        }

        if (minLong === undefined || wegenregisterMapDataBase.nodes[key].getLongitudeDeg() < minLong) {
          minLong = wegenregisterMapDataBase.nodes[key].getLongitudeDeg();
        }

        if (maxLat === undefined || wegenregisterMapDataBase.nodes[key].getLatitudeDeg() > maxLat) {
          maxLat = wegenregisterMapDataBase.nodes[key].getLatitudeDeg();
        }

        if (maxLong === undefined || wegenregisterMapDataBase.nodes[key].getLongitudeDeg() > maxLong) {
          maxLong = wegenregisterMapDataBase.nodes[key].getLongitudeDeg();
        }
      }
    }

    console.log((0, _tileUtils.getTileXYForLocation)(minLat, minLong, 14), (0, _tileUtils.getTileXYForLocation)(maxLat, maxLong, 14));
    console.log("Database lines:", Object.keys(wegenregisterMapDataBase.lines).length, "Database nodes:", Object.keys(wegenregisterMapDataBase.nodes).length);
    done();
  });
}, 120000);