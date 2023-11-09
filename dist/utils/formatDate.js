"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getformatedTime = void 0;
const getformatedTime = (date) => {
    return `${padDigits(date.getHours())}:${padDigits(date.getMinutes())}`;
};
exports.getformatedTime = getformatedTime;
const padDigits = (num, digits = 2) => {
    return Array(Math.max(digits - String(num).length + 1, 0)).join('0') + num;
};
