import mongoose from "mongoose";
export default async (uri: string) => {
	try {
		await mongoose.connect(uri, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});
		mongoose.set("useCreateIndex", true);
		console.log("[DATABASE]", "Connected to the database.");
	} catch (error) {
		console.error("Can't connect to the database.", error);
	}
};
