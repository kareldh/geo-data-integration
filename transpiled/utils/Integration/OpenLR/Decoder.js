"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Enum = require("./map/Enum");

var _LineDecoder = _interopRequireDefault(require("./coder/LineDecoder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OpenLRDecoder =
/*#__PURE__*/
function () {
  function OpenLRDecoder() {
    _classCallCheck(this, OpenLRDecoder);
  }

  _createClass(OpenLRDecoder, null, [{
    key: "decode",
    // static decode(encoded,mapDataBase,decoderProperties){
    //     let decoderProp = {};
    //     let rangeIncreases = 0;
    //     for(let k in decoderProperties){
    //         if(decoderProperties.hasOwnProperty(k)){
    //             decoderProp[k] = decoderProperties[k];
    //         }
    //     }
    //     if(encoded.type === locationTypeEnum.LINE_LOCATION){
    //         try {
    //             return LineDecoder.decode(mapDataBase,encoded.LRPs,encoded.posOffset,encoded.negOffset,decoderProp);
    //         }
    //         catch(e){
    //             if(!decoderProp.alwaysUseProjections){
    //                 // if decoding fails without always using projections,
    //                 // try again with always using projections
    //                 decoderProp.alwaysUseProjections = true;
    //                 return LineDecoder.decode(mapDataBase,encoded.LRPs,encoded.posOffset,encoded.negOffset,decoderProp);
    //             }
    //             else{
    //                 while(rangeIncreases < decoderProp.maxDecodeRetries){
    //                     rangeIncreases++;
    //                     decoderProp.dist = decoderProp.dist * decoderProp.distMultiplierForRetry;
    //                     decoderProp.distanceToNextDiff = decoderProp.distanceToNextDiff * decoderProp.distMultiplierForRetry;
    //                     try {
    //                         return LineDecoder.decode(mapDataBase,encoded.LRPs,encoded.posOffset,encoded.negOffset,decoderProp);
    //                     }
    //                     catch(err){
    //                         if(rangeIncreases >= decoderProp.maxDecodeRetries){
    //                             throw(err)
    //                         }
    //                     }
    //                 }
    //                 throw(e); //re-throw the error
    //             }
    //         }
    //     }
    // }
    // //retry with bigger dist and use no proj and always proj each time
    value: function decode(encoded, mapDataBase, decoderProperties) {
      var decoderProp = {};
      var rangeIncreases = 0;

      for (var k in decoderProperties) {
        if (decoderProperties.hasOwnProperty(k)) {
          decoderProp[k] = decoderProperties[k];
        }
      }

      if (decoderProp.maxDecodeRetries === undefined) {
        decoderProp.maxDecodeRetries = 0;
      }

      if (encoded.type === _Enum.locationTypeEnum.LINE_LOCATION) {
        while (rangeIncreases <= decoderProp.maxDecodeRetries) {
          try {
            return _LineDecoder["default"].decode(mapDataBase, encoded.LRPs, encoded.posOffset, encoded.negOffset, decoderProp);
          } catch (e) {
            if (!decoderProp.alwaysUseProjections) {
              // if decoding fails without always using projections,
              // try again with always using projections
              decoderProp.alwaysUseProjections = true;
            } else {
              if (decoderProp.dist && decoderProp.distMultiplierForRetry && decoderProp.distanceToNextDiff) {
                rangeIncreases++;

                if (rangeIncreases > decoderProp.maxDecodeRetries) {
                  throw e; //re-throw the error
                }

                var oldDist = decoderProp.dist;
                decoderProp.dist = decoderProp.dist * decoderProp.distMultiplierForRetry;
                decoderProp.distanceToNextDiff = decoderProp.distanceToNextDiff + (decoderProp.dist - oldDist) * 2;
                decoderProp.alwaysUseProjections = false;
              } else {
                throw e; //re-throw the error
              }
            }
          }
        }
      }
    } // //no retry mechanism
    // static decode(encoded,mapDataBase,decoderProperties){
    //     let decoderProp = {};
    //     for(let k in decoderProperties){
    //         if(decoderProperties.hasOwnProperty(k)){
    //             decoderProp[k] = decoderProperties[k];
    //         }
    //     }
    //     if(encoded.type === locationTypeEnum.LINE_LOCATION){
    //         return LineDecoder.decode(mapDataBase,encoded.LRPs,encoded.posOffset,encoded.negOffset,decoderProp);
    //     }
    // }

  }]);

  return OpenLRDecoder;
}();

exports["default"] = OpenLRDecoder;