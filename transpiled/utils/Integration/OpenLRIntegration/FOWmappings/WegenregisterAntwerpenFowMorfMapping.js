"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WegenregisterAntwerpenFowMorfMapping = void 0;

var _Enum = require("../../OpenLR/map/Enum");

//based on https://www.agiv.be/~/media/agiv/producten/mrb/documenten/wegenregister_objectcataloog.pdf
//or https://download.vlaanderen.be/Producten/GetDocument?id=280&title=Data_Wegenregister_v2_0_pdf&x=Data_Wegenregister_v2_0_pdf
var WegenregisterAntwerpenFowMorfMapping = {
  "autosnelweg": _Enum.fowEnum.MOTORWAY,
  "weg met gescheiden rijbanen die geen autosnelweg is": _Enum.fowEnum.MOTORWAY,
  "weg bestaande uit één rijbaan": _Enum.fowEnum.SINGLE_CARRIAGEWAY,
  "rotonde": _Enum.fowEnum.ROUNDABOUT,
  "speciale verkeerssituatie": _Enum.fowEnum.OTHER,
  "verkeersplein": _Enum.fowEnum.TRAFFICSQUARE,
  "op- of afrit, behorende tot een nietgelijkgrondse verbinding": _Enum.fowEnum.SLIPROAD,
  "op- of afrit, behorende tot een gelijkgrondse verbinding": _Enum.fowEnum.SLIPROAD,
  "parallelweg": _Enum.fowEnum.SLIPROAD,
  "ventweg": _Enum.fowEnum.SINGLE_CARRIAGEWAY,
  "in- of uitrit van een parking": _Enum.fowEnum.SLIPROAD,
  "in- of uitrit van een dienst": _Enum.fowEnum.SLIPROAD,
  "voetgangerszone": _Enum.fowEnum.OTHER,
  "wandel- of fietsweg, niet toegankelijk voor andere voertuigen": _Enum.fowEnum.OTHER,
  "tramweg, niet toegankelijk voor andere voertuigen": _Enum.fowEnum.OTHER,
  "dienstweg": _Enum.fowEnum.OTHER,
  "aardeweg": _Enum.fowEnum.OTHER,
  "veer": _Enum.fowEnum.OTHER,
  "niet gekend": _Enum.fowEnum.UNDEFINED
};
exports.WegenregisterAntwerpenFowMorfMapping = WegenregisterAntwerpenFowMorfMapping;