"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const indexController = require("../controllers/index.controller");
const router = (0, express_1.Router)();
router.get("/", indexController.index);
exports.default = router;
