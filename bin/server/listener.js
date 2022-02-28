"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3PipeServerRequestListener = void 0;
const errors_1 = require("./errors");
const http_1 = require("./http");
const utils_1 = require("./utils");
const s3_1 = require("./s3");
const settings_json_1 = __importDefault(require("../settings.json"));
const handleHttpOptionsMethod = (response) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, http_1.handleHttpResponse)(response, (response) => __awaiter(void 0, void 0, void 0, function* () {
        response.writeHead(200, {
            "Allow": "OPTIONS, GET"
        });
        response.end();
        return;
    }));
});
const listenerHandler = (request, response, customHandler) => __awaiter(void 0, void 0, void 0, function* () {
    const { authenticate, resolveObject } = customHandler;
    if (authenticate) {
        if (!(yield authenticate(request.headers))) {
            (0, errors_1.unAuthorizedError)(response);
            return;
        }
    }
    const { method, url } = request;
    const uri = ((l) => l || "")(url);
    if (method !== "OPTIONS" && method !== "GET") {
        (0, errors_1.badRequest)(response);
        return;
    }
    if (method === 'OPTIONS') {
        yield handleHttpOptionsMethod(response);
        return;
    }
    if (method === 'GET') {
        if (!(0, utils_1.uriIsNotNaN)(uri)) {
            (0, errors_1.notFound)(response);
            return;
        }
        var s3Object;
        if (resolveObject) {
            s3Object = resolveObject(uri);
        }
        else {
            s3Object = (0, s3_1.defaultObjectResolver)(uri);
            if (!settings_json_1.default.buckets["allow-any"]) {
                if (!(0, utils_1.bucketIsRegistered)(s3Object.Bucket)) {
                    (0, errors_1.notFound)(response);
                    return;
                }
            }
        }
        if (!s3Object.Bucket || !s3Object.Key) {
            (0, errors_1.notFound)(response);
            return;
        }
        // try {
        //     const val =  await handleS3ObjectPipe(s3Object, request, response)
        //     console.log('val', val)
        // } catch (e) {
        //     console.log(e)
        // }
        yield (0, s3_1.handleS3ObjectPipe)(s3Object, request, response);
    }
    // badRequest(response)
    // return "returend from last line"
});
class S3PipeServerRequestListener {
    constructor(customHandlers) {
        this.customHandlers = customHandlers;
    }
    createHandler() {
        return (request, response) => {
            var _a;
            if ((_a = this.customHandlers) === null || _a === void 0 ? void 0 : _a.requestListener) {
                this.customHandlers.requestListener(request, response);
            }
            console.log(request.headers);
            listenerHandler(request, response, this.customHandlers || {})
                .then(val => {
                console.log('listenerHandler returned', val);
            })
                .catch(e => {
                // handeling Unhandeled Errors
                console.log("UnHandeled Error");
                console.log(e);
            });
        };
    }
}
exports.S3PipeServerRequestListener = S3PipeServerRequestListener;
