"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._fromOneToOther = _fromOneToOther;
exports._fromOneToSame = _fromOneToSame;
exports.osmToWegenregister = osmToWegenregister;
exports.routableTilesToWegenregister = routableTilesToWegenregister;
exports.osmToRoutableTiles = osmToRoutableTiles;
exports.osmToWegenregisterNoEnc = osmToWegenregisterNoEnc;
exports.routableTilesToWegenregisterNoEnc = routableTilesToWegenregisterNoEnc;
exports.osmToRoutableTilesNoEnc = osmToRoutableTilesNoEnc;
exports.osmToOsm = osmToOsm;
exports.osmToOsmNoEncoding = osmToOsmNoEncoding;
exports.wegenregisterToWegenregister = wegenregisterToWegenregister;
exports.wegenregisterToWegenregisterNoEncoding = wegenregisterToWegenregisterNoEncoding;
exports.routableTilesToRoutableTiles = routableTilesToRoutableTiles;
exports.routableTilesToRoutableTilesNoEncoding = routableTilesToRoutableTilesNoEncoding;
exports.wegenregisterToWegenregisterNoShortLines = wegenregisterToWegenregisterNoShortLines;
exports.wegenregisterToWegenregisterNoEncodingNoShortLines = wegenregisterToWegenregisterNoEncodingNoShortLines;
exports.decoderProperties = exports.decoderPropertiesAlwaysProj = void 0;

var _MapDataBase = _interopRequireDefault(require("../OpenLR/map/MapDataBase"));

var _WegenregisterAntwerpenIntegration = _interopRequireDefault(require("../OpenLRIntegration/WegenregisterAntwerpenIntegration"));

var _LoadTestData = require("../Data/LoadTestData");

var _ParseData = require("../Data/ParseData");

var _OSMIntegration = _interopRequireDefault(require("../OpenLRIntegration/OSMIntegration"));

var _LineEncoder = _interopRequireDefault(require("../OpenLR/coder/LineEncoder"));

var _Decoder = _interopRequireDefault(require("../OpenLR/Decoder"));

var _RoutableTilesIntegration = _interopRequireDefault(require("../OpenLRIntegration/RoutableTilesIntegration"));

var _LinesDirectlyToLRPs = require("../OpenLR/experimental/LinesDirectlyToLRPs");

var _CoderSettings = require("../OpenLR/coder/CoderSettings");

var _LoadData = require("../Data/LoadData");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// demo that tries to find all nodes of OpenStreetMap
// in a specific bounding box: <bounds minlat="51.2093400" minlon="4.3917700" maxlat="51.2140400" maxlon="4.4034600"/>
// on the wegenregister Antwerpen
var decoderPropertiesAlwaysProj = {
  dist: 5,
  //maximum distance (in meter) of a candidate node to a LRP
  bearDiff: 60,
  //maximum difference (in degrees) between the bearing of a candidate node and that of a LRP
  frcDiff: 3,
  //maximum difference between the FRC of a candidate node and that of a LRP
  lfrcnpDiff: 3,
  //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
  distanceToNextDiff: 40,
  //maximum difference (in meter) between the found distance between 2 LRPs and the given distanceToNext of the first LRP
  alwaysUseProjections: true,
  useFrcFow: true,
  distMultiplier: 40,
  frcMultiplier: 35,
  fowMultiplier: 40,
  bearMultiplier: 30,
  maxSPSearchRetries: 1000,
  maxDecodeRetries: 2,
  distMultiplierForRetry: 2
};
exports.decoderPropertiesAlwaysProj = decoderPropertiesAlwaysProj;
var decoderProperties = {
  dist: 5,
  //maximum distance (in meter) of a candidate node to a LRP
  bearDiff: 60,
  //maximum difference (in degrees) between the bearing of a candidate node and that of a LRP
  frcDiff: 3,
  //maximum difference between the FRC of a candidate node and that of a LRP
  lfrcnpDiff: 3,
  //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
  distanceToNextDiff: 40,
  //maximum difference (in meter) between the found distance between 2 LRPs and the given distanceToNext of the first LRP
  alwaysUseProjections: false,
  useFrcFow: true,
  distMultiplier: 40,
  frcMultiplier: 35,
  fowMultiplier: 40,
  bearMultiplier: 30,
  maxSPSearchRetries: 1000,
  maxDecodeRetries: 2,
  distMultiplierForRetry: 2
};
exports.decoderProperties = decoderProperties;
var maxDecodedLines = 20;
var wegenregisterLineLengthLimit = 5; // in meter

var lineLengthLimitSameDataBase = 0; // in meter

var maxAmountOfWegenregisterLines = 1000;
var maxAmountOfLinesEncoded = 100;
var minLineLength = 0; // in meter

var minOffsetDiff = 1;

function clock(start) {
  if (!start) return process.hrtime();
  var end = process.hrtime(start);
  return Math.round(end[0] * 1000 + end[1] / 1000000);
}

var performance = {};

performance.now = function () {
  var t = process.hrtime();
  return Math.round(t[0] * 1000 + t[1] / 1000000);
};

function _fromOneToOther(fromDataBase, toDataBase, decoderProperties, encodeFunction) {
  var logging = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  if (logging) console.log("Encoder Lines:", Object.keys(fromDataBase.lines).length, "Decoder Lines:", Object.keys(toDataBase.lines).length);
  var locations = [];
  var encodeErrors = 0;
  var encodeErrorTypes = {};
  var decodedLines = [];
  var decodeErrors = 0;
  var decodeErrorTypes = {};
  var erroneousLocations = [];
  var encodeTimes = [];
  var encodeErrorTimes = [];
  var kortste = 100000;
  var x = 0;
  var t1 = clock();
  var linesEncoded = 0;

  for (var id in fromDataBase.lines) {
    if (fromDataBase.lines.hasOwnProperty(id) && fromDataBase.lines[id].getLength() >= minLineLength * _CoderSettings.configProperties.internalPrecision && linesEncoded < maxAmountOfLinesEncoded) {
      var t3 = void 0;
      var time4 = void 0;

      try {
        if (fromDataBase.lines[id].getLength() < kortste) {
          kortste = fromDataBase.lines[id].getLength();
        }

        if (fromDataBase.lines[id].getLength() < 1 * _CoderSettings.configProperties.internalPrecision) {
          x++;
        }

        t3 = clock();
        var location = encodeFunction(fromDataBase, id);
        time4 = clock(t3);
        locations.push(location);
        encodeTimes.push(time4);
        linesEncoded++;
      } catch (err) {
        // console.warn(err);
        encodeErrors++;

        if (encodeErrorTypes[err] === undefined) {
          encodeErrorTypes[err] = 0;
        }

        encodeErrorTypes[err]++;
        encodeErrorTimes.push(time4);
      }
    }
  }

  var time2 = clock(t1);
  var total = encodeTimes.length > 0 ? encodeTimes.reduce(function (previous, current) {
    return current += previous;
  }) : 0;
  var errorTotal = encodeErrorTimes.length > 0 ? encodeErrorTimes.reduce(function (previous, current) {
    return current += previous;
  }) : 0;
  if (logging) console.log("encoded locations: ", locations.length, "encode errors:", encodeErrors, "in time:", time2, "ms", "mean time:", total / encodeTimes.length, "ms,", "error mean time", encodeErrorTimes.length > 0 ? errorTotal / encodeErrorTimes.length : 0, "ms,");
  if (logging) console.log(encodeErrorTypes);
  if (logging) console.log("fromDataBase chortest:", kortste, "| Amount under 1 meter:", x);
  var times = [];
  var errorTimes = [];
  t1 = clock();

  for (var i = 0; i < locations.length; i++) {
    var _t = void 0;

    var _time = void 0;

    try {
      _t = clock();

      var decoded = _Decoder["default"].decode(locations[i], toDataBase, decoderProperties);

      _time = clock(_t);
      decodedLines.push(decoded);
      times.push(_time);
    } catch (err) {
      _time = clock(_t);

      if (decodeErrorTypes[err] === undefined) {
        decodeErrorTypes[err] = 0;
      }

      decodeErrorTypes[err]++;
      decodeErrors++;
      errorTimes.push(_time);
      erroneousLocations.push(locations[i]);
    }
  }

  time2 = clock(t1);
  var sum = times.length > 0 ? times.reduce(function (previous, current) {
    return current += previous;
  }) : 0;
  var errorSum = errorTimes.length > 0 ? errorTimes.reduce(function (previous, current) {
    return current += previous;
  }) : 0;
  if (logging) console.log("decoded lines: ", decodedLines.length, "decode errors:", decodeErrors, "in time:", time2, "ms,", "mean time:", sum / times.length, "ms,", "error mean time", errorSum / errorTimes.length, "ms,");
  if (logging) console.log(decodeErrorTypes);
  if (logging) console.warn(erroneousLocations[0]);

  for (var _i = 0; _i < decodedLines.length; _i++) {
    expect(decodedLines[_i].lines.length).toBeGreaterThan(0);
  }

  var kortsteTo = 100000000;
  var aantalUnder = 0;

  for (var key in toDataBase.lines) {
    if (toDataBase.lines.hasOwnProperty(key)) {
      if (toDataBase.lines[key].getLength() < kortsteTo) {
        kortsteTo = toDataBase.lines[key].getLength();
      }

      if (toDataBase.lines[key].getLength() < 1 * _CoderSettings.configProperties.internalPrecision) {
        aantalUnder++;
      }
    }
  }

  if (logging) console.log("toDataBase chortest:", kortsteTo, "| Amount under 1 meter:", aantalUnder);
  return {
    encodedLocations: locations.length,
    encodeErrors: encodeErrors,
    decodedLines: decodedLines.length,
    decodeErrors: decodeErrors,
    meanDecodeTime: sum / times.length
  };
}

function _fromOneToSame(mapDatabase, decoderProperties, encodeFunction, lineLimit, lineLengthLimit) {
  var logging = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
  if (logging) console.log("Encoder Lines:", Object.keys(mapDatabase.lines).length, "Decoder Lines:", Object.keys(mapDatabase.lines).length);
  var lineIds = [];
  var decodeErrorIndexes = [];
  var locations = [];
  var encodeErrors = 0;
  var encodeErrorTypes = {};
  var decodedLines = [];
  var decodeErrors = 0;
  var decodeErrorTypes = {};
  var erroneousLocations = [];
  var encodeTimes = [];
  var encodeErrorTimes = [];
  var linesEncoded = 0;
  var t1 = performance.now();

  for (var id in mapDatabase.lines) {
    if (mapDatabase.lines.hasOwnProperty(id) && mapDatabase.lines[id].getLength() > lineLengthLimitSameDataBase * _CoderSettings.configProperties.internalPrecision && (lineLimit === undefined || locations.length < lineLimit) && (lineLengthLimit === undefined || mapDatabase.lines[id].getLength() > lineLengthLimit * _CoderSettings.configProperties.internalPrecision) && linesEncoded < maxAmountOfLinesEncoded) {
      var t3 = void 0;
      var t4 = void 0;

      try {
        t3 = performance.now();
        var location = encodeFunction(mapDatabase, id); // let location = LinesDirectlyToLRPs([mapDatabase.lines[id]]);

        t4 = performance.now();
        locations.push(location);
        encodeTimes.push(t4 - t3);
        lineIds.push(id);
        linesEncoded++;
      } catch (err) {
        t4 = performance.now();

        if (encodeErrorTypes[err] === undefined) {
          encodeErrorTypes[err] = 0;
        }

        encodeErrorTypes[err]++;
        encodeErrors++;
        encodeErrorTimes.push(t4 - t3);
      }
    }
  }

  var t2 = performance.now();
  var total = encodeTimes.length > 0 ? encodeTimes.reduce(function (previous, current) {
    return current += previous;
  }) : 0;
  var errorTotal = encodeErrorTimes.length > 0 ? encodeErrorTimes.reduce(function (previous, current) {
    return current += previous;
  }) : 0;
  if (logging) console.log("encoded locations: ", locations.length, "encode errors:", encodeErrors, "in time:", t2 - t1, "ms", "mean time:", encodeTimes.length > 0 ? total / encodeTimes.length : 0, "ms,", "error mean time", encodeErrorTimes.length > 0 ? errorTotal / encodeErrorTimes.length : 0, "ms,");
  if (logging) console.log(encodeErrorTypes);
  var times = [];
  var errorTimes = [];
  t1 = performance.now();

  for (var i = 0; i < locations.length; i++) {
    var _t2 = void 0;

    var _t3 = void 0;

    try {
      _t2 = performance.now();

      var decoded = _Decoder["default"].decode(locations[i], mapDatabase, decoderProperties);

      _t3 = performance.now();
      decodedLines.push(decoded);
      times.push(_t3 - _t2);
    } catch (err) {
      if (decodeErrorTypes[err] === undefined) {
        decodeErrorTypes[err] = 0;
      }

      decodeErrorTypes[err]++;
      _t3 = performance.now();
      decodeErrors++;
      errorTimes.push(_t3 - _t2);
      erroneousLocations.push(locations[i]);
      decodeErrorIndexes.push(i);
      lineIds.splice(i, 1);
    }
  }

  t2 = performance.now();
  var sum = times.length > 0 ? times.reduce(function (previous, current) {
    return current += previous;
  }) : 0;
  var errorSum = errorTimes.length > 0 ? errorTimes.reduce(function (previous, current) {
    return current += previous;
  }) : 0;
  if (logging) console.log("decoded lines: ", decodedLines.length > 0 ? decodedLines.length : 0, "decode errors:", decodeErrors, "in time:", t2 - t1, "ms,", "mean time:", sum / times.length, "ms,", "error mean time", errorTimes.length > 0 ? errorSum / errorTimes.length : 0, "ms,");
  if (logging) console.log(decodeErrorTypes);
  var decodedToTwo = 0;
  var decodedToThree = 0;
  var decodedToMoreThanThree = 0;
  var originalLineNotPresent = 0;
  var minDiff = undefined;
  var maxDiff = undefined;
  var maxAmountOfLines = undefined;
  var offsetDiffs = [];
  var amountBothDiffsUnderMinOffsetDiff = 0;
  var a = 0;

  for (var _i2 = 0; _i2 < locations.length; _i2++) {
    if (a >= decodeErrorIndexes.length || _i2 !== decodeErrorIndexes[a]) {
      var diffBegin = undefined;
      var diffEnd = undefined;
      var originalLineIsNotPresent = false;

      if (decodedLines[_i2 - a].lines.length === 1) {
        if (decodedLines[_i2 - a].lines[0].getID() !== lineIds[_i2 - a]) {
          originalLineNotPresent++;
          originalLineIsNotPresent = true;
        } else {
          diffBegin = decodedLines[_i2 - a].posOffset;
          diffEnd = decodedLines[_i2 - a].negOffset;
        }
      } else if (decodedLines[_i2 - a].lines.length === 2) {
        decodedToTwo++;

        if (!(decodedLines[_i2 - a].lines[0].getID() === lineIds[_i2 - a] || decodedLines[_i2 - a].lines[1].getID() === lineIds[_i2 - a])) {
          originalLineNotPresent++;
          originalLineIsNotPresent = true;
        } else {
          if (decodedLines[_i2 - a].lines[0].getID() === lineIds[_i2 - a]) {
            //the first line is the correct one
            diffBegin = decodedLines[_i2 - a].posOffset;
            diffEnd = Math.round((decodedLines[_i2 - a].negOffset * _CoderSettings.configProperties.internalPrecision - decodedLines[_i2 - a].lines[1].getLength()) / _CoderSettings.configProperties.internalPrecision);
          } else {
            // the second line is the correct one
            diffBegin = Math.round((decodedLines[_i2 - a].posOffset * _CoderSettings.configProperties.internalPrecision - decodedLines[_i2 - a].lines[0].getLength()) / _CoderSettings.configProperties.internalPrecision);
            diffEnd = decodedLines[_i2 - a].negOffset;
          } // if (!((decodedLines[i - a].posOffset <= minOffsetDiff * configProperties.internalPrecision && decodedLines[i - a].negOffset >= (decodedLines[i - a].lines[1].getLength() - minOffsetDiff * configProperties.internalPrecision)) || (decodedLines[i - a].posOffset >= (decodedLines[i - a].lines[0].getLength() - minOffsetDiff * configProperties.internalPrecision) && decodedLines[i - a].negOffset <= minOffsetDiff * configProperties.internalPrecision))) {
          //     // console.log("Line encoded: ",lineIds[i]);
          //     // console.log("Original Line:",mapDatabase.lines[lineIds[i]]);
          //     // console.log("Encoded location:",locations[i]);
          //     // console.log("Decoded location:",decodedLines[i-a]);
          //     // console.log("First line result:",decodedLines[i - a].lines[0]);
          //     // console.log("Second line result:",decodedLines[i - a].lines[1]);
          // }
          // expect((decodedLines[i - a].posOffset <= minOffsetDiff * configProperties.internalPrecision && decodedLines[i - a].negOffset >= (decodedLines[i - a].lines[1].getLength() - minOffsetDiff * configProperties.internalPrecision)) || (decodedLines[i - a].posOffset >= (decodedLines[i - a].lines[0].getLength() - minOffsetDiff * configProperties.internalPrecision) && decodedLines[i - a].negOffset <= minOffsetDiff * configProperties.internalPrecision)).toBeTruthy(); //1 meter precision

        }
      } else if (decodedLines[_i2 - a].lines.length === 3) {
        decodedToThree++;

        if (!(decodedLines[_i2 - a].lines[0].getID() === lineIds[_i2 - a] || decodedLines[_i2 - a].lines[1].getID() === lineIds[_i2 - a] || decodedLines[_i2 - a].lines[2].getID() === lineIds[_i2 - a])) {
          originalLineNotPresent++;
          originalLineIsNotPresent = true;
        } else {
          expect(decodedLines[_i2 - a].lines[1].getID() === lineIds[_i2 - a]);
          diffBegin = Math.round((decodedLines[_i2 - a].posOffset * _CoderSettings.configProperties.internalPrecision - decodedLines[_i2 - a].lines[0].getLength()) / _CoderSettings.configProperties.internalPrecision);
          diffEnd = Math.round((decodedLines[_i2 - a].negOffset * _CoderSettings.configProperties.internalPrecision - decodedLines[_i2 - a].lines[2].getLength()) / _CoderSettings.configProperties.internalPrecision);
        }
      } else if (decodedLines[_i2 - a].lines.length > 3) {
        decodedToMoreThanThree++;
        var r = 0;

        while (r < decodedLines[_i2 - a].lines.length && decodedLines[_i2 - a].lines[r].getID() !== lineIds[_i2 - a]) {
          r++;
        }

        if (r >= decodedLines[_i2 - a].lines.length) {
          originalLineNotPresent++;
          originalLineIsNotPresent = true;
        } else {
          diffBegin = decodedLines[_i2 - a].posOffset * _CoderSettings.configProperties.internalPrecision;
          diffEnd = decodedLines[_i2 - a].negOffset * _CoderSettings.configProperties.internalPrecision;

          for (var x = 0; x < r; x++) {
            diffBegin -= decodedLines[_i2 - a].lines[x].getLength();
          }

          for (var _x = r + 1; _x < decodedLines[_i2 - a].lines.length; _x++) {
            diffEnd -= decodedLines[_i2 - a].lines[_x].getLength();
          }

          diffBegin = Math.round(diffBegin / _CoderSettings.configProperties.internalPrecision);
          diffEnd = Math.round(diffEnd / _CoderSettings.configProperties.internalPrecision);
        }
      }

      if (!originalLineIsNotPresent) {
        //check the minimum and maximum offset distance deviation if the original Line is present
        if (minDiff === undefined || minDiff > Math.abs(diffBegin)) {
          minDiff = Math.abs(diffBegin);
        }

        if (minDiff === undefined || minDiff > Math.abs(diffEnd)) {
          minDiff = Math.abs(diffEnd);
        }

        if (maxDiff === undefined || maxDiff < Math.abs(diffBegin)) {
          maxDiff = Math.abs(diffBegin);
        }

        if (maxDiff === undefined || maxDiff < Math.abs(diffEnd)) {
          maxDiff = Math.abs(diffEnd);
        }

        if (Math.abs(diffBegin) > minOffsetDiff || Math.abs(diffEnd) > minOffsetDiff) {
          // console.log("Line encoded: ",lineIds[i]);
          if (logging) console.log("Original Line:", mapDatabase.lines[lineIds[_i2]]);
          if (logging) console.log("Encoded location:", locations[_i2]);
          if (logging) console.log("Decoded location:", decodedLines[_i2 - a]);
          if (logging) console.log("Begin diff:", diffBegin, "End diff:", diffEnd);
        }

        expect(diffBegin).toBeDefined();
        expect(diffEnd).toBeDefined();
        offsetDiffs.push(Math.abs(diffBegin));
        offsetDiffs.push(Math.abs(diffEnd));

        if (Math.abs(diffBegin) <= minOffsetDiff && Math.abs(diffEnd) <= minOffsetDiff) {
          amountBothDiffsUnderMinOffsetDiff++;
        } //check the precision of the offset values (Are they under minOffsetDiff?)
        // expect(Math.abs(diffBegin)).toBeLessThanOrEqual(minOffsetDiff);
        // expect(Math.abs(diffEnd)).toBeLessThanOrEqual(minOffsetDiff);
        //check if the total amount of resulting lines after decoding is smaller than maxDecodedLines and bigger than 1


        expect(decodedLines[_i2 - a].lines.length).toBeGreaterThanOrEqual(1);
        expect(decodedLines[_i2 - a].lines.length).toBeLessThanOrEqual(maxDecodedLines);

        if (maxAmountOfLines === undefined || maxAmountOfLines < decodedLines[_i2 - a].lines.length) {
          maxAmountOfLines = decodedLines[_i2 - a].lines.length;
        }
      }
    } else {
      a++;
    }
  } //happens because encoder moves to valid nodes, which in combination with the rounding to meters has a small loss in precision
  //since nodes are than projected during decoding, they can be projected up to half a meter to the left or right of our original line


  if (logging) console.log("decoded to two:", decodedToTwo, "decoded to three:", decodedToThree, "decoded to more", decodedToMoreThanThree);
  if (logging) console.log("original line not present", originalLineNotPresent);
  var offsetErrorSum = offsetDiffs.length > 0 ? offsetDiffs.reduce(function (previous, current) {
    return current += previous;
  }) : 0;
  if (logging) console.log("Minimum offset error:", minDiff, "Maximum offset error:", maxDiff, "Mean offset error:", offsetDiffs.length > 0 ? offsetErrorSum / offsetDiffs.length : 0);
  if (logging) console.log("Maximum amount of resulting lines after decoding", maxAmountOfLines);
  if (logging) console.log("Amount of Lines were offsetDiff at both sides was lower than", minOffsetDiff, ":", amountBothDiffsUnderMinOffsetDiff);
  return {
    encodedLocations: locations.length,
    encodeErrors: encodeErrors,
    decodedLines: decodedLines.length,
    decodeErrors: decodeErrors,
    meanDecodeTime: sum / times.length
  };
}

function osmToWegenregister(decoderProperties) {
  return new Promise(function (resolve) {
    (0, _LoadData.loadNodesLineStringsWegenregisterAntwerpen)().then(function (features) {
      var wegenregisterMapDataBase = new _MapDataBase["default"]();

      _WegenregisterAntwerpenIntegration["default"].initMapDataBase(wegenregisterMapDataBase, features);

      (0, _LoadData.fetchOsmData)(51.2094, 51.2198, 4.3960, 4.4116).then(function (data) {
        (0, _ParseData.parseToJson)(data).then(function (json) {
          (0, _ParseData.getMappedElements)(json).then(function (elements) {
            (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
              var osmMapDataBase = new _MapDataBase["default"]();

              _OSMIntegration["default"].initMapDataBase(osmMapDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

              var result = _fromOneToOther(osmMapDataBase, wegenregisterMapDataBase, decoderProperties, function (fromDataBase, id) {
                return _LineEncoder["default"].encode(fromDataBase, [fromDataBase.lines[id]], 0, 0);
              });

              resolve(result);
            });
          });
        });
      });
    });
  });
}

function routableTilesToWegenregister(decoderProperties) {
  return new Promise(function (resolve) {
    (0, _LoadData.loadNodesLineStringsWegenregisterAntwerpen)().then(function (features) {
      var wegenregisterMapDataBase = new _MapDataBase["default"]();

      _WegenregisterAntwerpenIntegration["default"].initMapDataBase(wegenregisterMapDataBase, features);

      (0, _LoadData.fetchRoutableTile)(14, 8392, 5469).then(function (data) {
        (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
          var mapDatabase = new _MapDataBase["default"]();

          _RoutableTilesIntegration["default"].initMapDataBase(mapDatabase, nodesAndLines.nodes, nodesAndLines.lines);

          var result = _fromOneToOther(mapDatabase, wegenregisterMapDataBase, decoderProperties, function (fromDataBase, id) {
            return _LineEncoder["default"].encode(fromDataBase, [fromDataBase.lines[id]], 0, 0);
          });

          resolve(result);
        });
      });
    });
  });
}

function osmToRoutableTiles(decoderProperties) {
  var mapDatabase = new _MapDataBase["default"]();
  return new Promise(function (resolve) {
    var tilesLoaded = [];
    tilesLoaded.push((0, _LoadData.fetchRoutableTile)(14, 8392, 5469).then(function (data) {
      (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
        var nodesLines = _RoutableTilesIntegration["default"].getNodesLines(nodesAndLines.nodes, nodesAndLines.lines);

        mapDatabase.addData(nodesLines.lines, nodesLines.nodes);
      });
    }));
    tilesLoaded.push((0, _LoadData.fetchRoutableTile)(14, 8391, 5469).then(function (data) {
      (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
        var nodesLines = _RoutableTilesIntegration["default"].getNodesLines(nodesAndLines.nodes, nodesAndLines.lines);

        mapDatabase.addData(nodesLines.lines, nodesLines.nodes);
      });
    }));
    Promise.all(tilesLoaded).then(function () {
      (0, _LoadData.fetchOsmData)(51.2094, 51.2198, 4.3960, 4.4116).then(function (data) {
        (0, _ParseData.parseToJson)(data).then(function (json) {
          (0, _ParseData.getMappedElements)(json).then(function (elements) {
            (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
              var osmMapDataBase = new _MapDataBase["default"]();

              _OSMIntegration["default"].initMapDataBase(osmMapDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

              var result = _fromOneToOther(osmMapDataBase, mapDatabase, decoderProperties, function (fromDataBase, id) {
                return _LineEncoder["default"].encode(fromDataBase, [fromDataBase.lines[id]], 0, 0);
              });

              resolve(result);
            });
          });
        });
      });
    });
  });
}

function osmToWegenregisterNoEnc(decoderProperties) {
  return new Promise(function (resolve) {
    (0, _LoadData.loadNodesLineStringsWegenregisterAntwerpen)().then(function (features) {
      var wegenregisterMapDataBase = new _MapDataBase["default"]();

      _WegenregisterAntwerpenIntegration["default"].initMapDataBase(wegenregisterMapDataBase, features);

      (0, _LoadData.fetchOsmData)(51.2094, 51.2198, 4.3960, 4.4116).then(function (data) {
        (0, _ParseData.parseToJson)(data).then(function (json) {
          (0, _ParseData.getMappedElements)(json).then(function (elements) {
            (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
              var osmMapDataBase = new _MapDataBase["default"]();

              _OSMIntegration["default"].initMapDataBase(osmMapDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

              var result = _fromOneToOther(osmMapDataBase, wegenregisterMapDataBase, decoderProperties, function (fromDataBase, id) {
                return (0, _LinesDirectlyToLRPs.LinesDirectlyToLRPs)([fromDataBase.lines[id]]);
              });

              resolve(result);
            });
          });
        });
      });
    });
  });
}

function routableTilesToWegenregisterNoEnc(decoderProperties) {
  return new Promise(function (resolve) {
    (0, _LoadData.loadNodesLineStringsWegenregisterAntwerpen)().then(function (features) {
      var wegenregisterMapDataBase = new _MapDataBase["default"]();

      _WegenregisterAntwerpenIntegration["default"].initMapDataBase(wegenregisterMapDataBase, features);

      (0, _LoadData.fetchRoutableTile)(14, 8392, 5469).then(function (data) {
        (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
          var mapDatabase = new _MapDataBase["default"]();

          _RoutableTilesIntegration["default"].initMapDataBase(mapDatabase, nodesAndLines.nodes, nodesAndLines.lines);

          var result = _fromOneToOther(mapDatabase, wegenregisterMapDataBase, decoderProperties, function (fromDataBase, id) {
            return (0, _LinesDirectlyToLRPs.LinesDirectlyToLRPs)([fromDataBase.lines[id]]);
          });

          resolve(result);
        });
      });
    });
  });
}

function osmToRoutableTilesNoEnc(decoderProperties) {
  var mapDatabase = new _MapDataBase["default"]();
  return new Promise(function (resolve) {
    var tilesLoaded = [];
    tilesLoaded.push((0, _LoadData.fetchRoutableTile)(14, 8392, 5469).then(function (data) {
      (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
        var nodesLines = _RoutableTilesIntegration["default"].getNodesLines(nodesAndLines.nodes, nodesAndLines.lines);

        mapDatabase.addData(nodesLines.lines, nodesLines.nodes);
      });
    }));
    tilesLoaded.push((0, _LoadData.fetchRoutableTile)(14, 8391, 5469).then(function (data) {
      (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
        var nodesLines = _RoutableTilesIntegration["default"].getNodesLines(nodesAndLines.nodes, nodesAndLines.lines);

        mapDatabase.addData(nodesLines.lines, nodesLines.nodes);
      });
    }));
    Promise.all(tilesLoaded).then(function () {
      (0, _LoadData.fetchOsmData)(51.2094, 51.2198, 4.3960, 4.4116).then(function (data) {
        (0, _ParseData.parseToJson)(data).then(function (json) {
          (0, _ParseData.getMappedElements)(json).then(function (elements) {
            (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
              var osmMapDataBase = new _MapDataBase["default"]();

              _OSMIntegration["default"].initMapDataBase(osmMapDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

              var result = _fromOneToOther(osmMapDataBase, mapDatabase, decoderProperties, function (fromDataBase, id) {
                return (0, _LinesDirectlyToLRPs.LinesDirectlyToLRPs)([fromDataBase.lines[id]]);
              });

              resolve(result);
            });
          });
        });
      });
    });
  });
}

function osmToOsm(decoderProperties) {
  return new Promise(function (resolve) {
    (0, _LoadData.fetchOsmTileData)(14, 8392, 5469).then(function (data) {
      (0, _ParseData.parseToJson)(data).then(function (json) {
        (0, _ParseData.getMappedElements)(json).then(function (elements) {
          (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
            var osmMapDataBase = new _MapDataBase["default"]();

            _OSMIntegration["default"].initMapDataBase(osmMapDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

            var result = _fromOneToSame(osmMapDataBase, decoderProperties, function (fromDataBase, id) {
              return _LineEncoder["default"].encode(fromDataBase, [fromDataBase.lines[id]], 0, 0);
            });

            resolve(result);
          });
        });
      });
    });
  });
}

function osmToOsmNoEncoding(decoderProperties) {
  return new Promise(function (resolve) {
    (0, _LoadData.fetchOsmTileData)(14, 8392, 5469).then(function (data) {
      (0, _ParseData.parseToJson)(data).then(function (json) {
        (0, _ParseData.getMappedElements)(json).then(function (elements) {
          (0, _ParseData.filterHighwayData)(elements).then(function (highwayData) {
            var osmMapDataBase = new _MapDataBase["default"]();

            _OSMIntegration["default"].initMapDataBase(osmMapDataBase, highwayData.nodes, highwayData.ways, highwayData.relations);

            var result = _fromOneToSame(osmMapDataBase, decoderProperties, function (fromDataBase, id) {
              return (0, _LinesDirectlyToLRPs.LinesDirectlyToLRPs)([fromDataBase.lines[id]]);
            });

            resolve(result);
          });
        });
      });
    });
  });
}

function wegenregisterToWegenregister(decoderProperties) {
  return new Promise(function (resolve) {
    (0, _LoadData.loadNodesLineStringsWegenregisterAntwerpen)().then(function (features) {
      var wegenregisterMapDataBase = new _MapDataBase["default"]();

      _WegenregisterAntwerpenIntegration["default"].initMapDataBase(wegenregisterMapDataBase, features);

      var result = _fromOneToSame(wegenregisterMapDataBase, decoderProperties, function (fromDataBase, id) {
        return _LineEncoder["default"].encode(fromDataBase, [fromDataBase.lines[id]], 0, 0);
      }, maxAmountOfWegenregisterLines);

      resolve(result);
    });
  });
}

function wegenregisterToWegenregisterNoEncoding(decoderProperties) {
  return new Promise(function (resolve) {
    (0, _LoadData.loadNodesLineStringsWegenregisterAntwerpen)().then(function (features) {
      var wegenregisterMapDataBase = new _MapDataBase["default"]();

      _WegenregisterAntwerpenIntegration["default"].initMapDataBase(wegenregisterMapDataBase, features);

      var result = _fromOneToSame(wegenregisterMapDataBase, decoderProperties, function (fromDataBase, id) {
        return (0, _LinesDirectlyToLRPs.LinesDirectlyToLRPs)([fromDataBase.lines[id]]);
      }, maxAmountOfWegenregisterLines);

      resolve(result);
    });
  });
}

function routableTilesToRoutableTiles(decoderProperties) {
  return new Promise(function (resolve) {
    (0, _LoadData.fetchRoutableTile)(14, 8392, 5469).then(function (data) {
      (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
        var mapDatabase = new _MapDataBase["default"]();

        _RoutableTilesIntegration["default"].initMapDataBase(mapDatabase, nodesAndLines.nodes, nodesAndLines.lines);

        var result = _fromOneToSame(mapDatabase, decoderProperties, function (fromDataBase, id) {
          return _LineEncoder["default"].encode(fromDataBase, [fromDataBase.lines[id]], 0, 0);
        });

        resolve(result);
      });
    });
  });
}

function routableTilesToRoutableTilesNoEncoding(decoderProperties) {
  return new Promise(function (resolve) {
    (0, _LoadData.fetchRoutableTile)(14, 8392, 5469).then(function (data) {
      (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
        var mapDatabase = new _MapDataBase["default"]();

        _RoutableTilesIntegration["default"].initMapDataBase(mapDatabase, nodesAndLines.nodes, nodesAndLines.lines);

        var result = _fromOneToSame(mapDatabase, decoderProperties, function (fromDataBase, id) {
          return (0, _LinesDirectlyToLRPs.LinesDirectlyToLRPs)([fromDataBase.lines[id]]);
        });

        resolve(result);
      });
    });
  });
} // export function routableTilesToRoutableTiles4MeterOffsetsDiff(decoderProperties){
//     return new Promise(resolve=>{
//         fetchRoutableTile(14,8392,5469)
//             .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
//                 .then((nodesAndLines)=> {
//                     let mapDatabase = new MapDataBase();
//                     RoutableTilesIntegration.initMapDataBase(mapDatabase, nodesAndLines.nodes,nodesAndLines.lines);
//
//                     let lineIds = [];
//                     let decodeErrorIndexes = [];
//                     let locations = [];
//                     let encodeErrors = 0;
//                     let encodeErrorTypes = {};
//
//                     let decodedLines = [];
//                     let decodeErrors = 0;
//                     let decodeErrorTypes = {};
//
//                     let erroneousLocations = [];
//
//                     let encodeTimes = [];
//                     let encodeErrorTimes = [];
//                     let t1 = performance.now();
//                     for(let id in mapDatabase.lines){
//                         if(mapDatabase.lines.hasOwnProperty(id) && mapDatabase.lines[id].getLength() > lineLengthLimitSameDataBase*configProperties.internalPrecision){
//                             let t3;
//                             let t4;
//                             try {
//                                 t3 = performance.now();
//                                 let location = LineEncoder.encode(mapDatabase,[mapDatabase.lines[id]],0,0);
//                                 t4 = performance.now();
//                                 locations.push(location);
//                                 encodeTimes.push(t4-t3);
//                                 lineIds.push(id);
//                             }
//                             catch (err){
//                                 t4 = performance.now();
//                                 if(encodeErrorTypes[err] === undefined){
//                                     encodeErrorTypes[err] = 0;
//                                 }
//                                 encodeErrorTypes[err]++;
//                                 encodeErrors++;
//                                 encodeErrorTimes.push(t4-t3);
//                             }
//                         }
//                     }
//                     let t2 = performance.now();
//                     let total = encodeTimes.reduce((previous, current)=> current += previous);
//                     let errorTotal = encodeErrorTimes.length > 0 ? encodeErrorTimes.reduce((previous, current)=> current += previous) : 0;
//                     console.log("encoded locations: ",locations.length,"encode errors:",encodeErrors,
//                         "in time:",t2-t1,"ms",
//                         "mean time:",total/encodeTimes.length,"ms,",
//                         "error mean time",encodeErrorTimes.length > 0 ? errorTotal/encodeErrorTimes.length : 0,"ms,"
//                     );
//                     console.log(encodeErrorTypes);
//
//                     let times = [];
//                     let errorTimes = [];
//                     t1 = performance.now();
//                     for(let i=0;i<locations.length;i++){
//                         let t3;
//                         let t4;
//                         try {
//                             t3 = performance.now();
//                             let decoded = OpenLRDecoder.decode(locations[i],mapDatabase,decoderProperties);
//                             t4 = performance.now();
//                             decodedLines.push(decoded);
//                             times.push(t4-t3);
//                         }
//                         catch (err){
//                             if(decodeErrorTypes[err] === undefined){
//                                 decodeErrorTypes[err] = 0;
//                             }
//                             decodeErrorTypes[err]++;
//                             t4 = performance.now();
//                             decodeErrors++;
//                             errorTimes.push(t4-t3);
//                             erroneousLocations.push(locations[i]);
//                             decodeErrorIndexes.push(i);
//                             lineIds.splice(i,1);
//                         }
//                     }
//                     t2 = performance.now();
//                     let sum = times.reduce((previous, current)=> current += previous);
//                     let errorSum = errorTimes.length > 0 ? errorTimes.reduce((previous, current)=> current += previous) : 0;
//                     console.log("decoded lines: ",decodedLines.length,"decode errors:",decodeErrors,
//                         "in time:",t2-t1,"ms,",
//                         "mean time:",sum/times.length,"ms,",
//                         "error mean time",errorTimes.length > 0 ? errorSum/errorTimes.length : 0,"ms,"
//                     );
//                     console.log(decodeErrorTypes);
//
//                     let decodedToTwo = 0;
//                     let decodedToThree = 0;
//                     let decodedToMoreThanThree = 0;
//                     let originalLineNotPresent = 0;
//                     let a = 0;
//                     for(let i=0;i<locations.length;i++){
//                         if(a >= decodeErrorIndexes.length || i !== decodeErrorIndexes[a]){
//                             // if(decodedLines[i].lines.length === 2){
//                             //     console.log(osmMapDataBase.lines[lineIds[i]]);
//                             //     console.log(locations[i]);
//                             //     console.log(decodedLines[i].lines);
//                             //     console.log(decodedLines[i].posOffset,decodedLines[i].negOffset);
//                             // }
//                             // expect(decodedLines[i].lines.length).toEqual(1);
//                             if(decodedLines[i-a].lines.length===2){
//                                 decodedToTwo++;
//                                 // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i]).toBeTruthy();
//                                 if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a])){
//                                     originalLineNotPresent++;
//                                 }
//                                 // expect((decodedLines[i].posOffset === 0 && decodedLines[i].negOffset > 0) || (decodedLines[i].posOffset > 0 && decodedLines[i].negOffset === 0)).toBeTruthy();
//                                 expect((decodedLines[i-a].posOffset <= 4 && decodedLines[i-a].negOffset >= 0) || (decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset <= 4)).toBeTruthy(); //4 meter precision
//                             }
//                             else if(decodedLines[i-a].lines.length===3){
//                                 decodedToThree++;
//                                 // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i] || decodedLines[i].lines[2].getID() === lineIds[i]).toBeTruthy();
//                                 if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a] || decodedLines[i-a].lines[2].getID() === lineIds[i-a])){
//                                     originalLineNotPresent++;
//                                 }
//                                 // expect(decodedLines[i].posOffset > 0 && decodedLines[i].negOffset > 0).toBeTruthy();
//                                 expect(decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset >= 0).toBeTruthy(); //1 meter precision
//                             }
//                             else if(decodedLines[i-a].lines.length === 1){
//                                 // expect(decodedLines[i].lines[0].getID()).toEqual(lineIds[i]);
//                                 if(decodedLines[i-a].lines[0].getID() !== lineIds[i-a]){
//                                     originalLineNotPresent++;
//                                 }
//                             }
//                             expect(decodedLines[i-a].lines.length).toBeGreaterThanOrEqual(1);
//                             expect(decodedLines[i-a].lines.length).toBeLessThanOrEqual(maxDecodedLines);
//                             if(decodedLines[i-a].lines.length > 3){
//                                 decodedToMoreThanThree++;
//                             }
//                         }
//                         else{
//                             a++;
//                         }
//                     }
//                     //happens because encoder moves to valid nodes, which in combination with the rounding to meters has a small loss in precision
//                     //since nodes are than projected during decoding, they can be projected up to half a meter to the left or right of our original line
//                     console.log("decoded to two:",decodedToTwo,"decoded to three:",decodedToThree,"decoded to more",decodedToMoreThanThree);
//                     console.log("original line not present",originalLineNotPresent);
//
//                     resolve({
//                         encodedLocations: locations.length,
//                         encodeErrors: encodeErrors,
//                         decodedLines: decodedLines.length,
//                         decodeErrors: decodeErrors
//                     })
//                 });
//             })});
// }


function wegenregisterToWegenregisterNoShortLines(decoderProperties) {
  return new Promise(function (resolve) {
    (0, _LoadData.loadNodesLineStringsWegenregisterAntwerpen)().then(function (features) {
      var wegenregisterMapDataBase = new _MapDataBase["default"]();

      _WegenregisterAntwerpenIntegration["default"].initMapDataBase(wegenregisterMapDataBase, features);

      var result = _fromOneToSame(wegenregisterMapDataBase, decoderProperties, function (fromDataBase, id) {
        return _LineEncoder["default"].encode(fromDataBase, [fromDataBase.lines[id]], 0, 0);
      }, undefined, wegenregisterLineLengthLimit);

      resolve(result);
    });
  });
}

function wegenregisterToWegenregisterNoEncodingNoShortLines(decoderProperties) {
  return new Promise(function (resolve) {
    (0, _LoadData.loadNodesLineStringsWegenregisterAntwerpen)().then(function (features) {
      var wegenregisterMapDataBase = new _MapDataBase["default"]();

      _WegenregisterAntwerpenIntegration["default"].initMapDataBase(wegenregisterMapDataBase, features);

      var result = _fromOneToSame(wegenregisterMapDataBase, decoderProperties, function (fromDataBase, id) {
        return (0, _LinesDirectlyToLRPs.LinesDirectlyToLRPs)([fromDataBase.lines[id]]);
      }, undefined, wegenregisterLineLengthLimit);

      resolve(result);
    });
  });
}