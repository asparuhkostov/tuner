"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getRecordData_js_1 = __importDefault(require("./getRecordData.js"));
const getRecordPriceRange_js_1 = __importDefault(require("./getRecordPriceRange.js"));
exports.default = { getRecordData: getRecordData_js_1.default, getRecordPriceRange: getRecordPriceRange_js_1.default };
