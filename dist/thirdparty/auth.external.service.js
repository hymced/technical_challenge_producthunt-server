"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class AuthExternalService {
    constructor() {
        this.PH_API_HOST = process.env.PH_API_HOST || "api.producthunt.com";
        this.PH_API_URL = process.env.PH_API_URL || "https://api.producthunt.com/";
        this.PH_API_OAUTH = `${this.PH_API_URL + (this.PH_API_URL.slice(-1) === "/" ? "" : "/")}v2/oauth/token/`;
        this.getToken = () => {
            const requestBody = {
                "client_id": process.env.PH_APP_API_KEY,
                "client_secret": process.env.PH_APP_API_SECRET,
                "grant_type": "client_credentials"
            };
            return this.api.post('/', requestBody);
        };
        this.api = axios_1.default.create({
            baseURL: this.PH_API_OAUTH
        });
        this.api.interceptors.request.use(config => {
            let customConfig = {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Host": this.PH_API_HOST
            };
            config.headers = customConfig;
            return config;
        });
    }
}
const authExternalService = new AuthExternalService();
exports.default = authExternalService;
