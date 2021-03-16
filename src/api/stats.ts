import express, {
	NextFunction,
	request,
	Request,
	Response,
	Router,
} from "express";
import { Document } from "mongoose";
import stats from "../database/models/stats";
interface cacheInterface {
	data: Document<any, {}>[] | null;
	lastUpdated: number | null;
}
interface data {
	username: string;
	score: number;
	insertedDate: number;
}

let shouldUPdate = false;

const cache: cacheInterface = {
	data: null,
	lastUpdated: null,
};

const updateTime: number = 5 * 60 * 1000; // every 5 minutes
const router: Router = express.Router();

const getIp = (req: Request) => {
	return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
};
router.get("/", (req: Request, res: Response) => {
	// const ip: string | string[] = getIp(req);
	if (
		shouldUPdate ||
		cache.lastUpdated == null ||
		new Date().getTime() - cache.lastUpdated > updateTime
	) {
		stats.find({}).then((data) => {
			cache.data = data;
			cache.lastUpdated = new Date().getTime();
			res.json({
				"YAY!": "This works!!",
				cache: cache,
			});
		});
		// shouldUPdate = true;
	} else {
		res.json({
			"GOT IT FROM THE CACHE!!": "WOOOOOOOOOO",
			cache: cache,
		});
	}
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
	const ip: string | string[] = getIp(req);
	const data = req.body;
	data.insertedDate = new Date().getTime();
	data.ipAddress = ip.toString();
	stats
		.create(req.body)
		.then(() => {
			res.status(200);
			res.json({
				status: "Everything went ok!",
			});
		})
		.catch((e) => {
			res.status(400);
			next(e);
		});
});

router.get(
	"/top/:amount",
	(req: Request, res: Response, next: NextFunction) => {
		const { amount } = req.params;
		const num = parseInt(amount);
		if (isNaN(num)) {
			next(new TypeError("Id needs to be a valid number."));
			return;
		}
		if (
			shouldUPdate ||
			cache.lastUpdated == null ||
			new Date().getTime() - cache.lastUpdated > updateTime
		) {
			stats
				.find({})
				.then((DocumentData) => {
					cache.data = DocumentData;
					cache.lastUpdated = new Date().getTime();
					let data = handleData(DocumentData);
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
				.catch((e) => {
					next(e);
				});
		} else {
			let data = handleData(cache.data);
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
	}
);

const handleData = (data: Document<any, {}>[]) => {
	const newData: data[] = [];
	data.map((d) => {
		newData.push({
			username: d.get("username"),
			score: d.get("score"),
			insertedDate: d.get("insertedDate"),
		});
	});
	return newData;
};
export default router;
