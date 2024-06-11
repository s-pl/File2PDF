"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = exports.convert = void 0;
const listen_1 = __importDefault(require("./listen"));
exports.listen = listen_1.default;
const convert_1 = __importDefault(require("./convert"));
exports.convert = convert_1.default;
const defaultExport = function unoconv(input, options = {}) {
    return (0, convert_1.default)(input, options);
};
defaultExport.prototype = {
    convert: convert_1.default,
    listen: listen_1.default,
};
exports.default = defaultExport;
