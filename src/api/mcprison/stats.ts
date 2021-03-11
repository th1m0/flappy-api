import express, { Request, Response } from "express";

const routes: String[] = ["mcprison", "arkham", "gotpvp"];

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
	console.log(req.query.api_key);
	let response: Object = {};

	if (req.query.api_key == "123") {
		response = {
			blocksbroken: 10325000,
			ETokens: 152352245,
			timePlayed: new Date().getTime(),
		};
	}

	res.json(response);
});

export default router;
