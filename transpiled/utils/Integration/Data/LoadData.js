"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadNodesLineStringsWegenregisterAntwerpen = loadNodesLineStringsWegenregisterAntwerpen;
exports.fetchRoutableTile = fetchRoutableTile;
exports.fetchOsmData = fetchOsmData;
exports.fetchOsmTileData = fetchOsmTileData;

var _axios = _interopRequireDefault(require("axios"));

var _ldfetch = _interopRequireDefault(require("ldfetch"));

var _const = require("./const");

var _tileUtils = require("../../tileUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var REACT_APP_WEGENREGISTER_ANTWERPEN_URL = "http://portaal-stadantwerpen.opendata.arcgis.com/datasets/6bad868c084a43ef8031cfe1b96956b2_297.geojson";

function loadNodesLineStringsWegenregisterAntwerpen() {
  return new Promise(function (resolve, reject) {
    _axios["default"].get(REACT_APP_WEGENREGISTER_ANTWERPEN_URL).then(function (data) {
      resolve(data.data.features);
    })["catch"](function (error) {
      reject(error);
    });
  });
}

function fetchRoutableTile(z, x, y) {
  return new Promise(function (resolve, reject) {
    try {
      var fetch = new _ldfetch["default"]({
        headers: {
          accept: 'application/ld+json'
        }
      });
      fetch.get(_const.DATASET_URL + z + "/" + x + "/" + y).then(function (response) {
        resolve(response);
      });
    } catch (e) {
      reject(e);
    }
  });
}

function fetchOsmData(latLower, latUpper, longLower, longUpper) {
  return new Promise(function (resolve, reject) {
    _axios["default"].get("https://api.openstreetmap.org/api/0.6/map?bbox=" + longLower + "," + latLower + "," + longUpper + "," + latUpper).then(function (data) {
      return resolve(data.data);
    })["catch"](function (error) {
      reject(error);
    });
  });
}

function fetchOsmTileData(zoom, tileX, tileY) {
  var boundingBox = (0, _tileUtils.tile2boundingBox)(tileX, tileY, zoom);
  return fetchOsmData(boundingBox.latLower, boundingBox.latUpper, boundingBox.longLower, boundingBox.longUpper);
}