"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unoconv_1 = __importDefault(require("./unoconv"));
const listen = (options = {}) => {
    const unoconvOptions = Object.assign(Object.assign({}, options), { listener: true });
    return (0, unoconv_1.default)(unoconvOptions);
};
exports.default = listen;
