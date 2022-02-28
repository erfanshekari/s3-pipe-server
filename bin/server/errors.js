"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badRequest = exports.notFound = exports.unAuthorizedError = void 0;
const http_1 = require("./http");
const unAuthorizedError = (response) => {
    response.writeHead(403);
    response.write((0, http_1.httpErrorTemplate)("<center><h1>403 Unauthorized User</h1></center>", "Permission Denied"));
    response.end();
};
exports.unAuthorizedError = unAuthorizedError;
const notFound = (response) => {
    response.writeHead(404);
    response.write((0, http_1.httpErrorTemplate)("<center><h1>404 Notfound</h1></center>", "404 Notfound"));
    response.end();
};
exports.notFound = notFound;
const badRequest = (response) => {
    response.writeHead(400);
    response.write((0, http_1.httpErrorTemplate)("<center><h1>400 Bad Request</h1></center>", "400 Bad Request"));
    response.end();
};
exports.badRequest = badRequest;
