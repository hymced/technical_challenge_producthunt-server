"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const error_handling_1 = __importDefault(require("./error-handling"));
const app = (0, express_1.default)();
(0, config_1.default)(app);
app.use("/api", index_routes_1.default);
app.use("/api/posts", post_routes_1.default);
(0, error_handling_1.default)(app);
exports.default = app;
