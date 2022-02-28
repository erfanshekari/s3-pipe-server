"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createS3PipeServer = exports.S3PipeServer = void 0;
const http_1 = __importDefault(require("http"));
const listener_1 = require("./listener");
class S3PipeServer {
    constructor(customHandlers) {
        if (customHandlers && customHandlers.port) {
            this.port = customHandlers.port;
        }
        else {
            this.port = 9000;
        }
        if (customHandlers && customHandlers.host) {
            this.host = customHandlers.host;
        }
        else {
            this.host = '0.0.0.0';
        }
        this.customHandlers = customHandlers;
        this.requestListener = new listener_1.S3PipeServerRequestListener(this.customHandlers);
        this.server = http_1.default.createServer(this.requestListener.createHandler());
        // this.server.setTimeout(settings["request-timeout"])
    }
    listen(options, listeningListener) {
        if (options === null || options === void 0 ? void 0 : options.port) {
            this.port = options.port;
        }
        if (options === null || options === void 0 ? void 0 : options.host) {
            this.host = options.host;
        }
        var optionsOverwritten = {
            port: this.port,
            host: this.host
        };
        if (options) {
            optionsOverwritten = Object.assign(Object.assign({}, options), optionsOverwritten);
        }
        return this.server.listen(optionsOverwritten, listeningListener);
    }
}
exports.S3PipeServer = S3PipeServer;
const createS3PipeServer = (customHandlers) => new S3PipeServer(customHandlers);
exports.createS3PipeServer = createS3PipeServer;
