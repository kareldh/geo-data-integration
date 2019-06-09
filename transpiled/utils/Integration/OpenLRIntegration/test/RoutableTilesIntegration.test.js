"use strict";

var _MapDataBase = _interopRequireDefault(require("../../OpenLR/map/MapDataBase"));

var _RoutableTilesIntegration = _interopRequireDefault(require("../RoutableTilesIntegration"));

var _ParseData = require("../../Data/ParseData");

var _LineEncoder = _interopRequireDefault(require("../../OpenLR/coder/LineEncoder"));

var _Line = _interopRequireDefault(require("../../OpenLR/map/Line"));

var _Node = _interopRequireDefault(require("../../OpenLR/map/Node"));

var _LinesDirectlyToLRPs = require("../../OpenLR/experimental/LinesDirectlyToLRPs");

var _Decoder = _interopRequireDefault(require("../../OpenLR/Decoder"));

var _LoadData = require("../../Data/LoadData");

var _CoderSettings = require("../../OpenLR/coder/CoderSettings");

var _Enum = require("../../OpenLR/map/Enum");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

test("initMapDatabase", function (done) {
  expect.assertions(3);
  (0, _LoadData.fetchRoutableTile)(14, 8392, 5469).then(function (data) {
    (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
      var mapDatabase = new _MapDataBase["default"]();

      _RoutableTilesIntegration["default"].initMapDataBase(mapDatabase, nodesAndLines.nodes, nodesAndLines.lines);

      expect(mapDatabase).toBeDefined();
      expect(mapDatabase.lines).not.toEqual({});
      expect(mapDatabase.nodes).not.toEqual({});
      done();
    });
  });
});
test("encode way made of direct LRPs made via LinesDirectlyToLRP", function (done) {
  expect.assertions(3);
  var decoderProperties = {
    dist: 10,
    //maximum distance (in meter) of a candidate node to a LRP
    bearDiff: 60,
    //maximum difference (in degrees) between the bearing of a candidate node and that of a LRP
    frcDiff: 3,
    //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 3,
    //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 10,
    //maximum difference (in meter) between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: false,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
  };
  (0, _LoadData.fetchRoutableTile)(14, 8392, 5469).then(function (data) {
    (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
      var mapDatabase = new _MapDataBase["default"]();

      _RoutableTilesIntegration["default"].initMapDataBase(mapDatabase, nodesAndLines.nodes, nodesAndLines.lines);

      var n1 = new _Node["default"]("51.21179671373275_4.399219751358033", 51.21179671373275, 4.399219751358033);
      var n2 = new _Node["default"]("51.21178999272439_4.3991339206695566", 51.21178999272439, 4.3991339206695566);
      var n3 = new _Node["default"]("51.21180007423658_4.39905881881714", 51.21180007423658, 4.39905881881714);
      var n4 = new _Node["default"]("51.21182023725436_4.398962259292603", 51.21182023725436, 4.398962259292603);
      var n5 = new _Node["default"]("51.21183703976241_4.398828148841859", 51.21183703976241, 4.398828148841859);
      var n6 = new _Node["default"]("51.21186056326341_4.398618936538697", 51.21186056326341, 4.398618936538697);
      var n7 = new _Node["default"]("51.212045390353026_4.397251009941102", 51.212045390353026, 4.397251009941102);
      var l1 = new _Line["default"]("51.21179671373275_4.399219751358033_51.21178999272439_4.3991339206695566", n1, n2);
      var l2 = new _Line["default"]("51.21178999272439_4.3991339206695566_51.21180007423658_4.39905881881714", n2, n3);
      var l3 = new _Line["default"]("51.21180007423658_4.39905881881714_51.21182023725436_4.398962259292603", n3, n4);
      var l4 = new _Line["default"]("51.21182023725436_4.398962259292603_51.21183703976241_4.398828148841859", n4, n5);
      var l5 = new _Line["default"]("51.21183703976241_4.398828148841859_51.21186056326341_4.398618936538697", n5, n6);
      var l6 = new _Line["default"]("51.21186056326341_4.398618936538697_51.212045390353026_4.397251009941102", n6, n7);
      var lines = [l1, l2, l3, l4, l5, l6];
      var location = (0, _LinesDirectlyToLRPs.LinesDirectlyToLRPs)(lines);

      var decoded = _Decoder["default"].decode(location, mapDatabase, decoderProperties);

      expect(decoded).toBeDefined();
      expect(decoded.lines.length).toEqual(1);
      expect(decoded.lines[0].getID()).toEqual("http://www.openstreetmap.org/way/4579317_http://www.openstreetmap.org/node/28929725");
      done();
    });
  });
});
test("encode way at the edge of a tile, so that it's closest junction (=valid node) has one of it's roads missing and isn't valid anymore", function (done) {
  expect.assertions(4);
  (0, _LoadData.fetchRoutableTile)(14, 8392, 5469).then(function (data) {
    (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
      var mapDatabase = new _MapDataBase["default"]();

      _RoutableTilesIntegration["default"].initMapDataBase(mapDatabase, nodesAndLines.nodes, nodesAndLines.lines);

      var encoded = _LineEncoder["default"].encode(mapDatabase, [mapDatabase.lines["http://www.openstreetmap.org/way/25380916_http://www.openstreetmap.org/node/276645317"]], 0, 0);

      expect(encoded).toBeDefined();
      expect(encoded.LRPs.length).toEqual(2);
      expect(encoded.posOffset).not.toEqual(0);
      expect(encoded.negOffset).not.toEqual(0);
      done();
    });
  });
});
test("encode way at the edge of a tile, so that it's closest junction (=valid node) has one of it's roads only present in the adjecent tile", function (done) {
  expect.assertions(9);
  var mapDataBase = new _MapDataBase["default"]();
  var promises = [(0, _LoadData.fetchRoutableTile)(14, 8392, 5469).then(function (data) {
    (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
      var r = _RoutableTilesIntegration["default"].getNodesLines(nodesAndLines.nodes, nodesAndLines.lines);

      mapDataBase.addData(r.lines, r.nodes);
    });
  }), (0, _LoadData.fetchRoutableTile)(14, 8391, 5469).then(function (data) {
    (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
      var r = _RoutableTilesIntegration["default"].getNodesLines(nodesAndLines.nodes, nodesAndLines.lines);

      mapDataBase.addData(r.lines, r.nodes);
    });
  })];
  Promise.all(promises).then(function () {
    expect(mapDataBase).toBeDefined(); // console.log(mapDataBase.lines["http://www.openstreetmap.org/way/25380916_http://www.openstreetmap.org/node/276645317"]);
    // console.log(mapDataBase.nodes["http://www.openstreetmap.org/node/5982844531"]);

    expect(mapDataBase.nodes["http://www.openstreetmap.org/node/5982844531"].getIncomingLines().length).toEqual(3);
    expect(mapDataBase.nodes["http://www.openstreetmap.org/node/5982844531"].getOutgoingLines().length).toEqual(3);

    var encoded = _LineEncoder["default"].encode(mapDataBase, [mapDataBase.lines["http://www.openstreetmap.org/way/25380916_http://www.openstreetmap.org/node/276645317"]], 0, 0);

    expect(encoded).toBeDefined();
    expect(encoded.LRPs.length).toEqual(2);
    expect(encoded.LRPs[1].lat).toEqual(Number(Math.round(mapDataBase.nodes["http://www.openstreetmap.org/node/5982844531"].getLatitudeDeg() + 'e5') + 'e-5'));
    expect(encoded.LRPs[1]["long"]).toEqual(Number(Math.round(mapDataBase.nodes["http://www.openstreetmap.org/node/5982844531"].getLongitudeDeg() + 'e5') + 'e-5'));
    expect(encoded.posOffset).not.toEqual(0);
    expect(encoded.negOffset).toEqual(0);
    done();
  });
});
test("decode impact of FRC/FOW", function (done) {
  expect.assertions(23);
  var locationDefaultDecodedToRoad = {
    LRPs: [{
      bearing: 170,
      distanceToNext: 87,
      fow: 0,
      frc: 7,
      isLast: false,
      lat: 51.2122,
      lfrcnp: 7,
      "long": 4.40748,
      seqNr: 1
    }, {
      bearing: 352,
      distanceToNext: 0,
      fow: 0,
      frc: 7,
      isLast: true,
      lat: 51.21142,
      lfrcnp: 7,
      "long": 4.40767,
      seqNr: 2
    }],
    negOffset: 0,
    posOffset: 0,
    type: 1
  };
  var locationDefaultDecodedToBike = {
    LRPs: [{
      bearing: 170,
      distanceToNext: 87,
      fow: 0,
      frc: 7,
      isLast: false,
      lat: 51.21211,
      lfrcnp: 7,
      "long": 4.40738,
      seqNr: 1
    }, {
      bearing: 352,
      distanceToNext: 0,
      fow: 0,
      frc: 7,
      isLast: true,
      lat: 51.21147,
      lfrcnp: 7,
      "long": 4.40759,
      seqNr: 2
    }],
    negOffset: 0,
    posOffset: 0,
    type: 1
  };
  var expectedIdsRoad = ["http://www.openstreetmap.org/way/178553514_http://www.openstreetmap.org/node/1635567707", "http://www.openstreetmap.org/way/8414722_http://www.openstreetmap.org/node/27306720"];
  var expectedIdsBike = ["http://www.openstreetmap.org/way/178553520_http://www.openstreetmap.org/node/1888840697", "http://www.openstreetmap.org/way/178553520_http://www.openstreetmap.org/node/1888840692"];
  var decoderProp = {};

  for (var k in _CoderSettings.decoderProperties) {
    if (_CoderSettings.decoderProperties.hasOwnProperty(k)) {
      decoderProp[k] = _CoderSettings.decoderProperties[k];
    }
  }

  decoderProp.dist = 10;
  var mapDataBase = new _MapDataBase["default"]();
  var promises = [(0, _LoadData.fetchRoutableTile)(14, 8392, 5469).then(function (data) {
    (0, _ParseData.getRoutableTilesNodesAndLines)(data.triples).then(function (nodesAndLines) {
      var r = _RoutableTilesIntegration["default"].getNodesLines(nodesAndLines.nodes, nodesAndLines.lines);

      mapDataBase.addData(r.lines, r.nodes);
    });
  })];
  Promise.all(promises).then(function () {
    // defaults to road (if frcMultiplier 10 and fowMultiplier 20)
    locationDefaultDecodedToRoad.LRPs[0].frc = _Enum.frcEnum.FRC_4;
    locationDefaultDecodedToRoad.LRPs[0].fow = _Enum.fowEnum.SINGLE_CARRIAGEWAY;
    locationDefaultDecodedToRoad.LRPs[1].frc = _Enum.frcEnum.FRC_4;
    locationDefaultDecodedToRoad.LRPs[1].fow = _Enum.fowEnum.SINGLE_CARRIAGEWAY;

    var decoded = _Decoder["default"].decode(locationDefaultDecodedToRoad, mapDataBase, decoderProp);

    expect(decoded).toBeDefined();
    console.log(decoded);
    expect(decoded.lines.length).toEqual(2);
    expect(decoded.lines[0].getID()).toEqual(expectedIdsRoad[0]);
    expect(decoded.lines[1].getID()).toEqual(expectedIdsRoad[1]);
    expect(isNaN(decoded.posOffset)).not.toBeTruthy();
    expect(isNaN(decoded.negOffset)).not.toBeTruthy(); //defaulted to road, should now be bike

    locationDefaultDecodedToRoad.LRPs[0].frc = _Enum.frcEnum.FRC_7;
    locationDefaultDecodedToRoad.LRPs[0].fow = _Enum.fowEnum.OTHER;
    locationDefaultDecodedToRoad.LRPs[1].frc = _Enum.frcEnum.FRC_7;
    locationDefaultDecodedToRoad.LRPs[1].fow = _Enum.fowEnum.OTHER;
    decoderProp.frcMultiplier = 35;
    decoderProp.fowMultiplier = 40;

    var decoded2 = _Decoder["default"].decode(locationDefaultDecodedToRoad, mapDataBase, decoderProp);

    expect(decoded2).toBeDefined();
    console.log(decoded2);
    expect(decoded2.lines[1].getID()).toEqual(expectedIdsBike[0]);
    expect(decoded2.lines[2].getID()).toEqual(expectedIdsBike[1]);
    expect(decoded2.lines.length).toEqual(3);
    expect(isNaN(decoded2.posOffset)).not.toBeTruthy();
    expect(isNaN(decoded2.negOffset)).not.toBeTruthy(); //defaulted to bike

    decoderProp.frcMultiplier = 35;
    decoderProp.fowMultiplier = 40;

    var decoded3 = _Decoder["default"].decode(locationDefaultDecodedToBike, mapDataBase, decoderProp);

    expect(decoded3).toBeDefined();
    console.log(decoded3);
    expect(decoded3.lines[0].getID()).toEqual(expectedIdsBike[0]);
    expect(decoded3.lines[1].getID()).toEqual(expectedIdsBike[1]);
    expect(decoded3.lines.length).toEqual(2);
    expect(isNaN(decoded3.posOffset)).not.toBeTruthy();
    expect(isNaN(decoded3.negOffset)).not.toBeTruthy(); //defaulted to bike, should now be road

    locationDefaultDecodedToBike.LRPs[0].frc = _Enum.frcEnum.FRC_4;
    locationDefaultDecodedToBike.LRPs[0].fow = _Enum.fowEnum.SINGLE_CARRIAGEWAY;
    locationDefaultDecodedToBike.LRPs[1].frc = _Enum.frcEnum.FRC_4;
    locationDefaultDecodedToBike.LRPs[1].fow = _Enum.fowEnum.SINGLE_CARRIAGEWAY;
    decoderProp.frcMultiplier = 35;
    decoderProp.fowMultiplier = 40;

    var decoded4 = _Decoder["default"].decode(locationDefaultDecodedToBike, mapDataBase, decoderProp);

    expect(decoded4).toBeDefined();
    console.log(decoded4);
    expect(decoded4.lines.length).toEqual(1);
    expect(decoded4.lines[0].getID()).toEqual(expectedIdsRoad[1]);
    expect(isNaN(decoded4.posOffset)).not.toBeTruthy();
    expect(isNaN(decoded4.negOffset)).not.toBeTruthy();
    done();
  });
});