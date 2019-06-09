"use strict";

var _EncodeDecodeDemoTestFunctions = require("./EncodeDecodeDemoTestFunctions");

var _Enum = require("../OpenLR/map/Enum");

var _CoderSettings = require("../OpenLR/coder/CoderSettings");

/**
 * @jest-environment node
 */
describe.skip("tests using configProperties in centimeter", function () {
  describe("tests different databases osm to reg", function () {
    test('demo osm to wegenregister no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToWegenregister)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 160000);
    test('demo osm to wegenregister always proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToWegenregister)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 160000);
    test('demo osm to wegenregister no enc no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToWegenregisterNoEnc)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 160000);
    test('demo osm to wegenregister no enc always proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToWegenregisterNoEnc)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 160000);
  });
  describe("tests different databases osm to rt", function () {
    test('demo osm to RoutableTiles no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToRoutableTiles)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 160000);
    test('demo osm to RoutableTiles always proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToRoutableTiles)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 160000);
    test('demo osm to RoutableTiles no enc no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToRoutableTilesNoEnc)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 160000);
    test('demo osm to RoutableTiles no enc always proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToRoutableTilesNoEnc)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 160000);
  });
  describe("tests different databases rt to reg", function () {
    test('demo RoutableTiles to wegenregister no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.routableTilesToWegenregister)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 160000);
    test('demo RoutableTiles to wegenregister always proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.routableTilesToWegenregister)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 160000);
    test('demo RoutableTiles to wegenregister no enc no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.routableTilesToWegenregisterNoEnc)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 160000);
    test('demo RoutableTiles to wegenregister no enc always proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.routableTilesToWegenregisterNoEnc)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 160000);
  });
  describe("tests same database OSM", function () {
    test('demo osm to osm', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToOsm)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo osm to osm no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToOsm)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo osm to osm no encoding', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToOsmNoEncoding)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo osm to osm no encoding no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToOsmNoEncoding)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
  });
  describe("tests same database Routable Tiles", function () {
    test('demo RoutableTiles to RoutableTiles', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.routableTilesToRoutableTiles)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo RoutableTiles to RoutableTiles no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.routableTilesToRoutableTiles)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo RoutableTiles to RoutableTiles no encoding', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.routableTilesToRoutableTilesNoEncoding)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo RoutableTiles to RoutableTiles no encoding no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.routableTilesToRoutableTilesNoEncoding)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
  });
  describe("tests same database Wegenregister", function () {
    test('demo wegenregister to wegenregister', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.wegenregisterToWegenregister)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo wegenregister to wegenregister no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.wegenregisterToWegenregister)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo wegenregister to wegenregister no encoding', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.wegenregisterToWegenregisterNoEncoding)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo wegenregister to wegenregister no encoding no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.wegenregisterToWegenregisterNoEncoding)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
  });
  describe("tests wegenregister only lines longer than 5 meter", function () {
    test('demo wegenregister to wegenregister NoShortLines', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.wegenregisterToWegenregisterNoShortLines)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo wegenregister to wegenregister no proj NoShortLines', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.wegenregisterToWegenregisterNoShortLines)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo wegenregister to wegenregister no encoding NoShortLines', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.wegenregisterToWegenregisterNoEncodingNoShortLines)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo wegenregister to wegenregister no encoding no proj NoShortLines', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.wegenregisterToWegenregisterNoEncodingNoShortLines)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
  });
});
describe.skip("tests using configProperties in meter", function () {
  beforeEach(function () {
    _CoderSettings.configProperties.internalPrecision = _Enum.internalPrecisionEnum.METER;
    _CoderSettings.configProperties.bearDist = 20;
  });
  describe("tests different databases osm to reg", function () {
    test('demo osm to wegenregister no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToWegenregister)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo osm to wegenregister always proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToWegenregister)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo osm to wegenregister no enc no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToWegenregisterNoEnc)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo osm to wegenregister no enc always proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToWegenregisterNoEnc)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
  });
  describe("tests different databases osm to rt", function () {
    test('demo osm to RoutableTiles no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToRoutableTiles)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo osm to RoutableTiles always proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToRoutableTiles)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo osm to RoutableTiles no enc no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToRoutableTilesNoEnc)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo osm to RoutableTiles no enc always proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToRoutableTilesNoEnc)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
  });
  describe("tests different databases rt to reg", function () {
    test('demo RoutableTiles to wegenregister no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.routableTilesToWegenregister)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo RoutableTiles to wegenregister always proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.routableTilesToWegenregister)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo RoutableTiles to wegenregister no enc no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.routableTilesToWegenregisterNoEnc)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo RoutableTiles to wegenregister no enc always proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.routableTilesToWegenregisterNoEnc)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
  });
  describe("tests same database OSM", function () {
    test('demo osm to osm', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToOsm)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo osm to osm no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToOsm)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo osm to osm no encoding', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToOsmNoEncoding)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo osm to osm no encoding no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.osmToOsmNoEncoding)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
  });
  describe("tests same database Routable Tiles", function () {
    test('demo wegenregister to wegenregister', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.wegenregisterToWegenregister)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo wegenregister to wegenregister no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.wegenregisterToWegenregister)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo wegenregister to wegenregister no encoding', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.wegenregisterToWegenregisterNoEncoding)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo wegenregister to wegenregister no encoding no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.wegenregisterToWegenregisterNoEncoding)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
  });
  describe("tests same database Wegenregister", function () {
    test('demo RoutableTiles to RoutableTiles', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.routableTilesToRoutableTiles)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo RoutableTiles to RoutableTiles no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.routableTilesToRoutableTiles)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo RoutableTiles to RoutableTiles no encoding', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.routableTilesToRoutableTilesNoEncoding)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo RoutableTiles to RoutableTiles no encoding no proj', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.routableTilesToRoutableTilesNoEncoding)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
  });
  describe("tests wegenregister only lines longer than 5 meter", function () {
    test('demo wegenregister to wegenregister NoShortLines', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.wegenregisterToWegenregisterNoShortLines)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo wegenregister to wegenregister no proj NoShortLines', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.wegenregisterToWegenregisterNoShortLines)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo wegenregister to wegenregister no encoding NoShortLines', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.wegenregisterToWegenregisterNoEncodingNoShortLines)(_EncodeDecodeDemoTestFunctions.decoderPropertiesAlwaysProj).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
    test('demo wegenregister to wegenregister no encoding no proj NoShortLines', function (done) {
      expect.hasAssertions();
      (0, _EncodeDecodeDemoTestFunctions.wegenregisterToWegenregisterNoEncodingNoShortLines)(_EncodeDecodeDemoTestFunctions.decoderProperties).then(function (res) {
        console.log(res);
        expect(res).toBeDefined();
        done();
      });
    }, 60000);
  });
  afterEach(function () {
    _CoderSettings.configProperties.internalPrecision = _Enum.internalPrecisionEnum.CENTIMETER;
    _CoderSettings.configProperties.bearDist = 2000;
  });
});