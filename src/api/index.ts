import express, { Request, Response } from "express";
import stats from "./stats";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
	res.json({
		Hello: "World test",
	});
});

router.use("/stats", stats);

export default router;
