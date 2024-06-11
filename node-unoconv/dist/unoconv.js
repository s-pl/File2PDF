"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareCommandArgs = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const debug_1 = __importDefault(require("debug"));
const child_process_1 = require("child_process");
const constants_1 = require("./constants");
const debug = (0, debug_1.default)('node-unoconv:command');
const prepareCommandArgs = (options = {}) => {
    const { callback, debug: debug_, input } = options, opts = __rest(options, ["callback", "debug", "input"]);
    const args = [];
    const keys = Object.keys(opts);
    for (const keyIndex in keys) {
        const key = keys[keyIndex];
        const argName = constants_1.COMMAND_ARGUMENTS[key];
        const argValue = opts[key];
        switch (typeof argValue) {
            case 'boolean':
                if (argValue) {
                    args.push(argName);
                }
                break;
            case 'object':
                if (Array.isArray(argValue)) {
                    for (const index in argValue) {
                        args.push(argName, String(argValue[index]));
                    }
                }
                else {
                    const arr = Object.keys(argValue);
                    for (const index in arr) {
                        const key = arr[index];
                        const value = `${key}=${String(argValue[key])}`;
                        args.push(argName, value);
                    }
                }
                break;
            case 'string':
            default:
                args.push(argName, String(argValue));
                break;
        }
    }
    if (input) {
        args.push(input);
    }
    return args;
};
exports.prepareCommandArgs = prepareCommandArgs;

const run = (options) => {
    const stdout = [];
    const stderr = [];
    const { callback = (() => null) } = options;
    const cmdOptions = Object.assign(Object.assign({}, constants_1.DEFAULT_OPTIONS), options);
    if (options.debug) {
        debug_1.default.enable('node-unoconv:*');
    }
    if (options.output) {
        cmdOptions.stdout = false;
    }
    const args = (0, exports.prepareCommandArgs)(cmdOptions);
    debug(`Running command: python3 .\\unoconv ${args.join(' ')}`);
    const childProcess = (0, child_process_1.spawn)('python3', ['./unoconv', ...args]); // Use 'python' as the command and include args
    childProcess.stdout.on('data', (data) => {
        stdout.push(data);
    });
    childProcess.stderr.on('data', (data) => {
        stderr.push(data);
    });
    childProcess.on('close', (code) => {
        debug('node-unoconv finished with code: %s', code);
        if (stderr.length) {
            const error = new Error(Buffer.concat(stderr).toString('utf8'));
            debug('%o', error);
            callback(error);
            return;
        }
        const result = options.output || Buffer.concat(stdout);
        callback(null, result);
    });
    childProcess.on('error', (err) => {
        if (err.message.indexOf('ENOENT') > -1) {
            debug('unoconv command not found. %o', err);
            return;
        }
        debug('%o', err);
    });
    return childProcess;
};

const unoconv = (options) => {
    if (!options.callback) {
        // Return a promise if there is no callback
        return new Promise((resolve, reject) => {
            // Assign a fake callback that would either resolve or reject the promise
            options.callback = (err, result) => {
                return err
                    ? reject(err)
                    : resolve(result);
            };
            return run(options);
        });
    }
    return run(options);
};

exports.default = unoconv;
