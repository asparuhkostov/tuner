"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const index_js_1 = require("../utils/index.js");
const DISCOGS_API_KEY = process.env.DISCOGS_API_KEY || "YOUR_DISCOGS_API_KEY_HERE";
const DISCOGS_API_SECRET = process.env.DISCOGS_API_SECRET || "YOUR_DISCOGS_API_SECRET_HERE";
exports.default = async (req, res) => {
    const { item } = req.body;
    let albumData = "";
    await (0, axios_1.default)({
        method: "GET",
        url: `https://api.discogs.com/database/search?q=${item}&key=${DISCOGS_API_KEY}&secret=${DISCOGS_API_SECRET}`,
    })
        .then((response) => {
        albumData = response.data.results[0];
    })
        .catch((e) => index_js_1.log.error(e));
    res.json({ albumData });
};
