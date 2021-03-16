import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { config } from "dotenv";
config();

import api from "./api";
import mongodb from "./database";
import middlewares from "./middlewares";

const app = express();

// Connecting to the database in sync
(() => {
	console.log("[DATABASE]", "Loading database");
	mongodb("mongodb://localhost/flappy");
})();

/**
 * RATE LIMITING
 * 100 requests per 60 seconds.
 */
app.use(
	rateLimit({
		windowMs: 60 * 1000,
		max: 100,
		message:
			"You have been rate limitted! You can only do 100 requests per minute.",
		statusCode: 429,
	})
);
/**
 * Adding logging and securrity
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

// adding core rout.
app.use("/api/v1", api);

// adding middlewares
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
