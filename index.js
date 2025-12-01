import express from "express";
import logger from "./startup/log.js";
import dbConnect from "./startup/db.js";
import routeHandler from "./startup/routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
logger();
dbConnect();
routeHandler(app);

const port = process.env.PORT || 2001;
app.listen(port, () => console.log(`Server Running on http://localhost:${port}...`));