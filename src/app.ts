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
(async () => {
	console.log("[DATABASE]", "Loading database");
	await mongodb("mongodb://localhost/flappy");
})();

app.use(
	rateLimit({
		windowMs: 60 * 1000,
		max: 100,
		message:
			"You have been rate limitted! you can only do 100 requests per minute.",
		statusCode: 429,
	})
);
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
