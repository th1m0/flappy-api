import { stringify, parse } from "uuid";
export default class UUID {
	public test: string;
	public least: BigInt;
	public most: BigInt;
	public uuid: String;
	constructor(least: BigInt = null, most: BigInt = null, uuid: String = null) {
		this.least = least;
		this.most = most;
		this.uuid = uuid;
		if (least != null && BigInt != null) {
			const leastByte = BigInt.asUintN(64, BigInt(least))
				.toString(16)
				.split("")
				.reduce((acc, val, idx, arr) => (idx % 2 ? [...acc, parseInt(arr[idx - 1] + val, 16)] : acc), []);

			const mostByte = BigInt.asUintN(64, BigInt(most))
				.toString(16)
				.split("")
				.reduce((acc, val, idx, arr) => (idx % 2 ? [...acc, parseInt(arr[idx - 1] + val, 16)] : acc), []);

			const bytes = [...mostByte, ...leastByte];
			this.uuid = stringify(bytes);
		} else if (uuid != null) {
			let bytes: ArrayLike<Number> = parse(uuid.toString());
			let msb = BigInt(0);
			let lsb = BigInt(0);
			if (bytes.length > 16) return;
			for (let i = 0; i < 8; i++) {
				msb = (msb << BigInt(8)) | (BigInt(bytes[i]) & BigInt(0xff));
			}
			for (let i = 8; i < 16; i++) {
				lsb = (lsb << BigInt(8)) | (BigInt(bytes[i]) & BigInt(0xff));
			}
			this.least = BigInt.asIntN(64, lsb);
			this.most = BigInt.asIntN(64, msb);
		}
	}
}
