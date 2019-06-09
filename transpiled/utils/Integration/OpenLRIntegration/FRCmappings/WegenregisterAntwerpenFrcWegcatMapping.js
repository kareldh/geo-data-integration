"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WegenregisterAntwerpenFrcWegcatMapping = void 0;

var _Enum = require("../../OpenLR/map/Enum");

//based on https://www.agiv.be/~/media/agiv/producten/mrb/documenten/wegenregister_objectcataloog.pdf
//or https://download.vlaanderen.be/Producten/GetDocument?id=280&title=Data_Wegenregister_v2_0_pdf&x=Data_Wegenregister_v2_0_pdf
var WegenregisterAntwerpenFrcWegcatMapping = {
  "hoofdweg": _Enum.frcEnum.FRC_0,
  "primaire weg I": _Enum.frcEnum.FRC_1,
  "primaire weg II": _Enum.frcEnum.FRC_2,
  "primaire weg II type 1": _Enum.frcEnum.FRC_2,
  "primaire weg II type 2": _Enum.frcEnum.FRC_3,
  "primaire weg II type 3": _Enum.frcEnum.FRC_3,
  "primaire weg II type 4": _Enum.frcEnum.FRC_0,
  "secundaire weg": _Enum.frcEnum.FRC_4,
  "secundaire weg type 1": _Enum.frcEnum.FRC_4,
  "secundaire weg type 2": _Enum.frcEnum.FRC_5,
  "secundaire weg type 3": _Enum.frcEnum.FRC_5,
  "secundaire weg type 4": _Enum.frcEnum.FRC_5,
  "lokale weg": _Enum.frcEnum.FRC_6,
  "lokale weg type 1": _Enum.frcEnum.FRC_6,
  "lokale weg type 2": _Enum.frcEnum.FRC_6,
  "lokale weg type 3": _Enum.frcEnum.FRC_6,
  "niet gekend": _Enum.frcEnum.FRC_7,
  "niet van toepassing": _Enum.frcEnum.FRC_7
};
exports.WegenregisterAntwerpenFrcWegcatMapping = WegenregisterAntwerpenFrcWegcatMapping;