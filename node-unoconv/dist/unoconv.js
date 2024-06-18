"use strict";

const __rest = (this && this.__rest) || function (s, e) {
    const t = {};
    for (const p in s) if (Object.prototype.hasOwnProperty.call(s, p) && !e.includes(p))
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") {
        for (const p of Object.getOwnPropertySymbols(s)) {
            if (!e.includes(p) && Object.prototype.propertyIsEnumerable.call(s, p))
                t[p] = s[p];
        }
    }
    return t;
};

const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareCommandArgs = void 0;

const debug_1 = __importDefault(require("debug"));
const child_process_1 = require("child_process");
const constants_1 = require("./constants");

const debug = (0, debug_1.default)('node-unoconv:command');

const prepareCommandArgs = (options = {}) => {
    const { callback, debug: debug_, input, ...opts } = options;
    const args = [];

    for (const [key, value] of Object.entries(opts)) {
        const argName = constants_1.COMMAND_ARGUMENTS[key];
        switch (typeof value) {
            case 'boolean':
                if (value) args.push(argName);
                break;
            case 'object':
                if (Array.isArray(value)) {
                    for (const item of value) {
                        args.push(argName, String(item));
                    }
                } else {
                    for (const [subKey, subValue] of Object.entries(value)) {
                        args.push(argName, `${subKey}=${String(subValue)}`);
                    }
                }
                break;
            default:
                args.push(argName, String(value));
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
    const { callback = () => null, ...restOptions } = options;
    const cmdOptions = { ...constants_1.DEFAULT_OPTIONS, ...restOptions };

    if (options.debug) {
        debug_1.default.enable('node-unoconv:*');
    }
    
    if (options.output) {
        cmdOptions.stdout = false;
    }
    
    const args = prepareCommandArgs(cmdOptions);
    debug(`Running command: python3 ./unoconv ${args.join(' ')}`);
    const childProcess = (0, child_process_1.spawn)('python3', ['./unoconv',...args]);

    childProcess.stdout.on('data', (data) => stdout.push(data));
    childProcess.stderr.on('data', (data) => stderr.push(data));

    childProcess.on('close', (code) => {
        debug('node-unoconv finished with code: %s', code);
        if (stderr.length) {
            const error = new Error(Buffer.concat(stderr).toString('utf8'));
            debug('%o', error);
            callback(error);
        } else {
            const result = options.output || Buffer.concat(stdout);
            callback(null, result);
        }
    });

    childProcess.on('error', (err) => {
        if (err.message.includes('ENOENT')) {
            debug('unoconv command not found. %o', err);
        } else {
            debug('%o', err);
        }
    });

    return childProcess;
};

const unoconv = (options) => {
    if (!options.callback) {
        return new Promise((resolve, reject) => {
            options.callback = (err, result) => err ? reject(err) : resolve(result);
            run(options);
        });
    }
    return run(options);
};

exports.default = unoconv;
