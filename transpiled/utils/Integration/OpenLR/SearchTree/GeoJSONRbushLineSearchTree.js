"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _helpers = require("@turf/helpers");

var _GeoJSONRbushSearchTree = _interopRequireDefault(require("./GeoJSONRbushSearchTree"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RbushLineSearchTree =
/*#__PURE__*/
function (_GeoJSONRbushSearchTr) {
  _inherits(RbushLineSearchTree, _GeoJSONRbushSearchTr);

  function RbushLineSearchTree(lines) {
    var _this;

    _classCallCheck(this, RbushLineSearchTree);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RbushLineSearchTree).call(this));

    _this.addLines(lines);

    return _this;
  } //one line === Line object


  _createClass(RbushLineSearchTree, [{
    key: "addLines",
    value: function addLines(lines) {
      var data = []; //todo: maybe this could already be made in the openlr integration classes to speed this up

      for (var id in lines) {
        if (lines.hasOwnProperty(id)) {
          if (lines[id].getStartNode() === undefined || lines[id].getEndNode() === undefined) {
            throw lines[id];
          }

          data.push((0, _helpers.lineString)([[lines[id].getStartNode().getLongitudeDeg(), lines[id].getStartNode().getLatitudeDeg()], [lines[id].getEndNode().getLongitudeDeg(), lines[id].getEndNode().getLatitudeDeg()]], {
            id: id
          }));
        }
      }

      this.tree.load(data);
    } //todo: remove lines

  }]);

  return RbushLineSearchTree;
}(_GeoJSONRbushSearchTree["default"]);

exports["default"] = RbushLineSearchTree;