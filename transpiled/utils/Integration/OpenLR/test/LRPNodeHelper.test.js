"use strict";

var _LRPNodeHelper = _interopRequireDefault(require("../coder/LRPNodeHelper"));

var _Line = _interopRequireDefault(require("../map/Line"));

var _Node = _interopRequireDefault(require("../Map/Node"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import {loadNodesLineStringsWegenregsterAntwerpen} from "../../Data/LoadData";
// import MapDataBase from "../map/MapDataBase";
// import WegenregisterAntwerpenIntegration from "../../OpenLRIntegration/WegenregisterAntwerpenIntegration";
test('lrpLinesToLRPs single line from wegenregister Antwerpen', function () {
  expect.assertions(12); // loadNodesLineStringsWegenregisterAntwerpen().then(features => {
  // let wegenregisterMapDataBase = new MapDataBase();
  // WegenregisterAntwerpenIntegration.initMapDataBase(wegenregisterMapDataBase,features);
  //
  // let lines = [wegenregisterMapDataBase.lines["51.16968550738436_4.399282793207395_51.16968943633098_4.399279221440794"],wegenregisterMapDataBase.lines["51.16968550738436_4.399282793207395_51.16968943633098_4.399279221440794"]];

  var n1 = new _Node["default"]("51.16968550738436_4.399282793207395", 51.16968550738436, 4.399282793207395);
  var n2 = new _Node["default"]("51.16968943633098_4.399279221440794", 51.16968943633098, 4.399279221440794);
  var l1 = new _Line["default"]("51.16968550738436_4.399282793207395_51.16968943633098_4.399279221440794", n1, n2);
  var lines = [l1, l1];
  var shortestPaths = [{
    lines: [],
    length: 0
  }];

  var LRP = _LRPNodeHelper["default"].lrpLinesToLRPs(lines, shortestPaths);

  console.log(LRP);
  expect(LRP).toBeDefined();
  expect(LRP.length).toEqual(2);
  expect(LRP[0].lat).toEqual(Number(Math.round(51.16968550738436 + 'e5') + 'e-5'));
  expect(LRP[0]["long"]).toEqual(Number(Math.round(4.399282793207395 + 'e5') + 'e-5'));
  expect(LRP[1].lat).toEqual(Number(Math.round(51.16968943633098 + 'e5') + 'e-5'));
  expect(LRP[1]["long"]).toEqual(Number(Math.round(4.399279221440794 + 'e5') + 'e-5')); //note in this example, the rounded coordinates should be exactly the same, which means that this lines
  //will never be decoded properly because the LRP doesn't represent a line, but only a single point

  expect(LRP[0].distanceToNext).toEqual(1);
  expect(LRP[0].seqNr).toEqual(1);
  expect(LRP[0].isLast).toEqual(false);
  expect(LRP[1].distanceToNext).toEqual(0);
  expect(LRP[1].seqNr).toEqual(2);
  expect(LRP[1].isLast).toEqual(true); // });
});