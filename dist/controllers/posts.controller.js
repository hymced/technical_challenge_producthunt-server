"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.posts_list = void 0;
const auth_external_service_1 = __importDefault(require("../thirdparty/auth.external.service"));
const posts_external_service_1 = __importDefault(require("../thirdparty/posts.external.service"));
const credentials = __importStar(require("../config/credentials"));
const graphql_request_1 = require("graphql-request");
const axios_1 = require("axios");
const utils = __importStar(require("../utils/formatDate"));
let refreshTokenCount = 0;
exports.posts_list = ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield auth_external_service_1.default.getToken();
        credentials.saveToken(response.data.access_token);
        return credentials.PH_APP_CLIENT_CREDENTIALS_TOKEN;
    });
    const startConditionalChaining = () => {
        if (!credentials.PH_APP_CLIENT_CREDENTIALS_TOKEN) {
            return refreshToken();
        }
        else {
            return Promise.resolve(credentials.PH_APP_CLIENT_CREDENTIALS_TOKEN);
        }
    };
    try {
        yield startConditionalChaining();
        const data = yield posts_external_service_1.default.getPostsData(req.query.date);
        const dataEx = data;
        dataEx.posts.edges.forEach(edge => {
            const edgeEx = edge;
            // tricky trick because the first signature of the overloaded forEach method resulting from the intersection is used 
            // (since an edge of DataEx extends an edge of Data aka an edge in dataEx can be assigned to a edge in data), 
            // thus, the edge value of the callbackfn has the type of an edge from Data, and its real type must be asserted
            // alternative: change Data everywhere and add createdAtFormatted beforehand...
            edgeEx.node.createdAtFormatted = utils.getformatedTime(new Date(edgeEx.node.createdAt));
        });
        res.status(200).json(dataEx);
    }
    catch (error) {
        if (error instanceof axios_1.AxiosError) {
            if (error.response) {
                //
            }
        }
        if (error instanceof graphql_request_1.ClientError) {
            if (error.response.errors) {
                if (error.response.errors[0].error === "invalid_oauth_token") {
                    // token expired
                    refreshTokenCount++;
                    if (refreshTokenCount < 3) {
                        console.log("refreshing token and trying again to query the api");
                        yield refreshToken();
                        return (0, exports.posts_list)(req, res, next);
                    }
                }
            }
        }
        next(error);
    }
}));
