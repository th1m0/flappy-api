import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { config } from "dotenv";
config();

import api from "./api";
import mongodb from "./database";
import middlewares from "./middlewares";

const app = express();

/**
 * init, preloading databases and some utils if they need preloading
 */

mongodb("mongodb://localhost/flappy");

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.json({
		message: "home page.",
	});
});

app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
