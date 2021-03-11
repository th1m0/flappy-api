import express, { Request, Response } from "express";
import stats from "./stats";
const rout: String = "/api/v1/server/";

const routes: Object = {
	stats: ["Showing all sorts of stats", "Example: " + rout + "stats?uuid=UUID"],
};

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
	res.json(routes);
});

router.use("/stats", stats);

export default router;
