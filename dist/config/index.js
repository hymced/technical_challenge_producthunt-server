"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
// dotenv must be configured first
// ES6 imports are hoisted, so imported modules will initialize (in order) before any of the current "imported" module initialization code gets to run 
(0, dotenv_1.config)(); // .env default
(0, dotenv_1.config)({ path: ".env.dev.env" });
const FRONTEND_URL = process.env.ORIGIN || "http://localhost:4200";
// Middleware configuration
exports.default = (app) => {
    // To log requests with a different format dependending on the environenment
    if (app.get("env") === "production") {
        app.use((0, morgan_1.default)("combined"));
    }
    else {
        app.use((0, morgan_1.default)("dev"));
    }
    // In case Express is running behind a proxy that some hosting services may use, so that the X-Forwarded-* headers may be trusted (X-Forwarded-For)
    app.set("trust proxy", 1);
    // Protect application from some well-known web vulnerabilities (XSS (Cross-Site Scripting), Cross-Site Request Forgery (CSRF), Clickjacking, Sniffing, etc.) by setting security-related HTTP response headers appropriately 
    app.use((0, helmet_1.default)());
    // To have access to `body` property in the request
    app.use(express_1.default.json());
    // To allow cross-origin requests
    app.use((0, cors_1.default)({
        credentials: true,
        origin: [FRONTEND_URL],
    }));
    // or manually on a per request basis with
    // res.header("Access-Control-Allow-Origin", "*");
};
