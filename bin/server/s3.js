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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleS3ObjectPipe = exports.defaultObjectResolver = exports.parseObjectKeyFromURI = exports.parseBucketFromURI = exports.createS3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const utils_1 = require("./utils");
const errors_1 = require("./errors");
const http_1 = require("./http");
const credentials = {
    accessKeyId: (0, utils_1.getEnviron)("STORAGE_ACCESS"),
    secretAccessKey: (0, utils_1.getEnviron)("STORAGE_SECRET")
};
const s3Config = {
    endpoint: (0, utils_1.getEnviron)("STORAGE_URL"),
    region: (0, utils_1.getEnviron)("STORAGE_REGION"),
    credentials
};
const createS3Client = () => new client_s3_1.S3Client(s3Config);
exports.createS3Client = createS3Client;
const parseBucketFromURI = (uri) => {
    const splited = uri.split("/");
    return (splited.length < 1) && "" || splited[1];
};
exports.parseBucketFromURI = parseBucketFromURI;
const parseObjectKeyFromURI = (uri) => {
    const uriAry = uri.split("/");
    if (uriAry.length < 2)
        return "";
    var Key = "";
    for (let i = 2; i <= uriAry.length; i++) {
        if (uriAry[i])
            Key += uriAry[i];
        if (i === (uriAry.length - 1))
            break;
        Key += "/";
    }
    return Key;
};
exports.parseObjectKeyFromURI = parseObjectKeyFromURI;
const defaultObjectResolver = (uri) => ({
    Bucket: (0, exports.parseBucketFromURI)(uri),
    Key: (0, exports.parseObjectKeyFromURI)(uri)
});
exports.defaultObjectResolver = defaultObjectResolver;
const contentLengthCaculator = (contentRange) => {
    const splited = contentRange.split(" ");
    if (splited.length === 2) {
        const bytesRange = splited[1].split("/")[0].split("-").map(v => parseInt(v));
        if (bytesRange.length === 2) {
            return bytesRange[1] - bytesRange[0];
        }
    }
    return 0;
};
const handleS3ObjectPipe = (s3object, request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const range = request.headers.range;
    if (range) {
        s3object.Range = range;
    }
    else {
        s3object.Range = 'bytes 0-';
    }
    console.log(s3object);
    const objectGetResponse = yield (0, exports.createS3Client)().send(new client_s3_1.GetObjectCommand(s3object)).catch(r => r);
    console.log(objectGetResponse.$metadata);
    if (objectGetResponse.$metadata.httpStatusCode !== 200 && objectGetResponse.$metadata.httpStatusCode !== 206) {
        console.log('returning not found bacasue of status code');
        (0, errors_1.notFound)(response);
        return;
    }
    yield (0, http_1.handleHttpResponse)(response, (res) => __awaiter(void 0, void 0, void 0, function* () {
        if (objectGetResponse.ContentType) {
            res.setHeader("Content-Type", objectGetResponse.ContentType);
        }
        if (objectGetResponse.ETag) {
            res.setHeader("ETag", objectGetResponse.ETag);
        }
        if (objectGetResponse.ContentRange) {
            res.setHeader("Content-Range", objectGetResponse.ContentRange);
            const contentLength = contentLengthCaculator(objectGetResponse.ContentRange);
            console.log(contentLength, objectGetResponse.ContentRange);
            if (contentLength) {
                res.setHeader("Content-Length", contentLength);
            }
            else if (objectGetResponse.ContentLength) {
                res.setHeader("Content-Length", objectGetResponse.ContentLength);
            }
            res.writeHead(206);
        }
        const Stream = objectGetResponse.Body;
        // Stream.pipe(res)
        Stream.pipe(res);
        // Stream.on("data", (chunk:any) => res.write(chunk))
        request.on("close", () => Stream.destroy());
        console.log('actully its returning from s3 listender');
    }));
});
exports.handleS3ObjectPipe = handleS3ObjectPipe;
