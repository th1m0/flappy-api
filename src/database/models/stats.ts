import { Schema, model } from "mongoose";
const statsSchema: Schema = new Schema({
	username: {
		type: Schema.Types.String,
		required: true,
	},
	score: {
		type: Schema.Types.Number,
		required: true,
	},
	insertedDate: {
		type: Schema.Types.Date,
		required: true,
		default: new Date(),
	},
	ipAddress: {
		type: Schema.Types.String,
	},
});

export default model("stats", statsSchema);
