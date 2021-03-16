import { Request, Response, NextFunction } from "express";

const env: string = "production";

function notFound(req: Request, res: Response, next: NextFunction) {
	res.status(404);
	const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
	next(error);
}

function errorHandler(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) {
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
	res.status(statusCode);
	res.json({
		message: err.message,
		stack: env == "production" ? "🥞" : err.stack,
	});
}

export default {
	notFound,
	errorHandler,
};
