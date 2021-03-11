import express, { Request, Response } from "express";

const routes: String[] = ["mcprison", "arkham", "gotpvp"];

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
	res.json({
		servers: [...routes],
	});
});

export default router;
