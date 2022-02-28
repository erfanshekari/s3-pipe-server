"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucketIsRegistered = exports.uriIsNotNaN = exports.getEnvironAsArray = exports.getEnviron = void 0;
const getEnviron = (name) => {
    if (process === null || process === void 0 ? void 0 : process.env[name]) {
        return `${process.env[name]}`;
    }
    return '';
};
exports.getEnviron = getEnviron;
const getEnvironAsArray = (name) => {
    var _a;
    if (process === null || process === void 0 ? void 0 : process.env[name]) {
        const envAry = (_a = process.env[name]) === null || _a === void 0 ? void 0 : _a.split(",").map(value => value.trim());
        if (envAry === null || envAry === void 0 ? void 0 : envAry.length) {
            return envAry;
        }
    }
    return [];
};
exports.getEnvironAsArray = getEnvironAsArray;
const uriIsNotNaN = (uri) => uri.split("/").length >= 1;
exports.uriIsNotNaN = uriIsNotNaN;
const bucketIsRegistered = (bucket) => {
    const allowedBuckets = (0, exports.getEnvironAsArray)("STORAGE_BUCKETS");
    if (!allowedBuckets.length)
        return false;
    for (let i = 0; i < allowedBuckets.length; i++) {
        if (allowedBuckets[i] === bucket) {
            return true;
        }
    }
    return false;
};
exports.bucketIsRegistered = bucketIsRegistered;
