"use strict";

var _LoadData = require("../LoadData");

test('loadNodesLineStringsWegenregisterAntwerpen', function (done) {
  expect.assertions(1);
  (0, _LoadData.loadNodesLineStringsWegenregisterAntwerpen)().then(function (data) {
    console.log(data.length);
    expect(data).toBeDefined();
    done();
  });
}, 10000);