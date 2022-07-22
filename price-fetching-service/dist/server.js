"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const index_js_1 = __importDefault(require("./routes/index.js"));
const server = (0, express_1.default)();
server.use(body_parser_1.default.urlencoded({ extended: true }));
server.use(body_parser_1.default.json());
server.use((0, cors_1.default)());
server.use((0, helmet_1.default)());
server.post("/getRecordData", index_js_1.default.getRecordData);
server.post("/getRecordPriceRange", index_js_1.default.getRecordPriceRange);
server.listen(5000, () => {
    console.log("Server started on port 5000.");
});
