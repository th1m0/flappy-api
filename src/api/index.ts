import express, { Request, Response } from "express";
import server from "./server";
import mcprison from "./mcprison";

const servers: String[] = ["arkham", "mcprison", "gotpvp"];

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
	res.json({
		servers: [...servers],
	});
});

router.use("/server", server);
router.use("/mcprison", mcprison);

export default router;
