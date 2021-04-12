import express, { NextFunction, request, Request, Response, Router } from "express";
import { Document } from "mongoose";
import stats from "../database/models/stats";
interface CacheInterface {
	data: Document<any, {}>[] | null;
	lastUpdated: number | null;
}
interface Data {
	username: string;
	score: number;
	insertedDate: number;
}

let shouldUPdate = false;

const cache: CacheInterface = {
	data: null,
	lastUpdated: null,
};

const updateTime: number = Number.MAX_VALUE; // no updating needed as this is the only way to insert / update the database. Everything will remain in cache.
const router: Router = express.Router();

const getIp = (req: Request) => {
	return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
};
router.get("/", (req: Request, res: Response) => {
	// const ip: string | string[] = getIp(req);
	if (shouldUPdate || cache.lastUpdated == null || new Date().getTime() - cache.lastUpdated > updateTime) {
		stats.find({}).then((documentData: Document<any, {}>[]) => {
			shouldUPdate = false;
			cache.data = documentData;
			cache.lastUpdated = new Date().getTime();
			const data: Data[] = handleData(documentData);
			res.json({
				data,
				lastUpdated: cache.lastUpdated,
			});
		});
	} else {
		const data = handleData(cache.data);
		res.json({
			data,
			lastUpdated: cache.lastUpdated,
		});
	}
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
	const ip: string | string[] = getIp(req);
	const data: any = req.body;
	data.insertedDate = new Date().getTime();
	data.ipAddress = ip.toString();
	stats
		.create(data)
		.then(() => {
			cache.data = data;
			cache.lastUpdated = new Date().getTime();
			res.status(200);
			res.json({
				status: "ok",
				data: req.body,
			});
		})
		.catch(e => {
			res.status(400);
			next(e);
		});
});

router.get("/top/:amount", (req: Request, res: Response, next: NextFunction) => {
	const { amount } = req.params;
	const num: number = parseInt(amount, 36);
	if (isNaN(num)) {
		next(new TypeError("Amount needs to be a valid number."));
		return;
	}
	if (shouldUPdate || cache.lastUpdated == null || new Date().getTime() - cache.lastUpdated > updateTime) {
		stats
			.find({})
			.then(DocumentData => {
				shouldUPdate = false;
				cache.data = DocumentData;
				cache.lastUpdated = new Date().getTime();
				let data: Data[] = handleData(DocumentData);
				data.sort((a, b) => {
					return b.score - a.score;
				});
				if (data.length < num) {
					res.json({
						amount: data.length,
						data,
					});
				} else {
					data = data.slice(0, num);
					res.json({
						amount: data.length,
						data,
					});
				}
			})
			.catch(e => {
				next(e);
			});
	} else {
		let data: Data[] = handleData(cache.data);
		data.sort((a, b) => {
			const c: number = a.score;
			const d: number = b.score;
			return d - c;
		});
		if (data.length < num) {
			res.json({
				amount: data.length,
				data,
			});
		} else {
			data = data.slice(0, num);
			res.json({
				amount: data.length,
				data,
			});
		}
	}
});

/**
 * This can fully run on cache and doesn't need to call the database ever.
 * 
 * Update this to update cache if it's outdated. Only do this when the database
 * is getting updated without the cache being updated.
 */
router.get("/calctop/:score", (req: Request, res: Response, next: NextFunction) => {
	let { score }: any | number = req.params;
	score = parseInt(score)
	if (isNaN(score)) {
		next(new TypeError("Score must be a valid number."));
		return;
	}
	if (cache.data == null) {
		stats.find({})
		.then((DocumentData) => {
			cache.data = DocumentData
			cache.lastUpdated = new Date().getTime();
			const place: number = DocumentData.filter(d => d.get("score") >= score).length
			res.json({
				success: 200,
				place,
			})
		})
		.catch(e => {
			next(new EvalError("Could not query the database."))
		})
		return
	} 
	const place: number = cache.data.filter(d => d.get("score") >= score).length
	res.json({
		success: 200,
		place,
	})
})

const handleData = (data: Document<any, {}>[]) => {
	const newData: Data[] = [];
	data.map((d: Document<any, {}>) => {
		newData.push({
			username: d.get("username"),
			score: d.get("score"),
			insertedDate: d.get("insertedDate"),
		});
	});
	return newData;
};
export default router;
