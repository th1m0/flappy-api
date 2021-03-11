import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { config } from "dotenv";
config();

import middlewares from "./middlewares";
import api from "./api";

const app = express();

/**
 * init, preloading databases and some utils if they need preloading
 */
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.json({
		message: "home page.",
	});
});

// app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
