import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";

import routesMap from "./routes/index.js";

const server = express();
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cors());
server.use(helmet());

server.post("/getRecordData", routesMap.getRecordData);
server.post("/getRecordPriceRange", routesMap.getRecordPriceRange);

server.listen(5000, () => {
  console.log("Server started on port 5000.");
});
