"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadOsmTestData = loadOsmTestData;

var _osmMap = require("./testdata/osmMap");

function loadOsmTestData() {
  return new Promise(function (resolve) {
    resolve(_osmMap.map);
  });
}