import express, { NextFunction, request, Request, Response } from "express";

const router = express.Router();

// GET LEADER BOARD (param is amount.)
router.get("/", (req: Request, res: Response) => {
	res.json({
		sup: "hi",
	});
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
	console.log(request.body);

	res.status(200);
});

export default router;
