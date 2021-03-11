import mongoose, { mongo } from "mongoose";

export default async () => {
	console.log("[DATABASE] [MONGODB] Connecting.");
	try {
		await mongoose.connect(process.env.mongo_uri, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});
		mongoose.set("useCreateIndex", true);
		console.log("[DATABASE] [MONGODB] Connected.");
	} catch (error) {
		console.log("[DATABASE] [MONGODB] failed. " + error);
	}
};
