"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.download = download;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function download(_uri) {
  return new Promise(function (resolve, reject) {
    _axios["default"].get(_uri).then(function (response) {
      return resolve(response.data);
    })["catch"](function (error) {
      return reject(error);
    });
  });
}