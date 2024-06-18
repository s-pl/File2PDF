"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = exports.COMMAND_ARGUMENTS = void 0;
exports.COMMAND_ARGUMENTS = {
    connection: '-c',
    disableHtmlUpdateLinks: '--disable-html-update-links',
    doctype: '-d',
    export: '-e',
    field: '-F',
    format: '-f',
    import: '-i',
    inputFilterName: '-I',
    listener: '-l',
    noLaunch: '-n',
    output: '-o',
    password: '--password',
    pipe: '--pipe',
    port: '-p',
    preserve: '--preserve',
    printer: '--printer',
    server: '--server',
    show: '--show',
    stdin: '--stdin',
    stdout: '--stdout',
    template: '-t',
    timeout: '-T',
    unsafeQuietUpdate: '--unsafe-quiet-update',
    userProfile: '--user-profile',
    verbose: '--verbose',
    healess: '--headless'
};
exports.DEFAULT_OPTIONS = {
    format: 'pdf',
    stdout: true,
};
exports.default = {
    COMMAND_ARGUMENTS: exports.COMMAND_ARGUMENTS,
};
