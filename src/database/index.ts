import mongoose from "mongoose";
export default async (uri: string) => {
	mongoose
		.connect(uri, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		})
		.finally(() => {
			console.log("[DATABASE] database has succefully been loaded.");
		})
		.catch((error: Error) =>
			console.error(
				"[DATABASE] something went wrong loading the database",
				error
			)
		);
	mongoose.set("useCreateIndex", true);
};
