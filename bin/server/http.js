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
exports.httpErrorTemplate = exports.handleHttpResponse = void 0;
const settings_json_1 = __importDefault(require("../settings.json"));
const handleHttpResponse = (response, customHandler) => __awaiter(void 0, void 0, void 0, function* () {
    if (settings_json_1.default["use-cors"]) {
        const corsConfig = settings_json_1.default["cors-config"];
        for (const key in corsConfig) {
            response.setHeader(key, corsConfig[key]);
        }
    }
    response.setHeader("Accept-Ranges", "bytes");
    return yield customHandler(response);
});
exports.handleHttpResponse = handleHttpResponse;
const httpErrorTemplate = (body, title) => {
    return `<html><head><title>${title}</title></head><body>` + body + "</body></html>";
};
exports.httpErrorTemplate = httpErrorTemplate;
