import axios from "axios";
import { Request, Response } from "express";
import { log } from "../utils/index.js";

const DISCOGS_API_KEY =
  process.env.DISCOGS_API_KEY || "YOUR_DISCOGS_API_KEY_HERE";
const DISCOGS_API_SECRET =
  process.env.DISCOGS_API_SECRET || "YOUR_DISCOGS_API_SECRET_HERE";

export default async (req: Request, res: Response) => {
  const { item } = req.body;
  let albumData = "";

  await axios({
    method: "GET",
    url: `https://api.discogs.com/database/search?q=${item}&key=${DISCOGS_API_KEY}&secret=${DISCOGS_API_SECRET}`,
  })
    .then((response) => {
      albumData = response.data.results[0];
    })
    .catch((e) => log.error(e));

  res.json({ albumData });
};
