import mysqlAsync from "mysql2/promise";
import mysqlSync from "mysql2";

let connectionAsync: mysqlAsync.Pool;
let connectionSync: mysqlSync.Pool;

const mysqlConfig: mysqlSync.ConnectionOptions = {
	host: process.env.mysql_host,
	user: process.env.mysql_user,
	password: process.env.mysql_password,
	database: process.env.mysql_database,
	port: parseInt(process.env.mysql_port),
	connectionLimit: parseInt(process.env.mysql_connection_limit),
	queueLimit: parseInt(process.env.mysql_queue_limit),
	waitForConnections: true,
};

export default () => {
	console.log("[DATABASE] [MARIADB] Connecting.");
	connectionAsync = mysqlAsync.createPool(mysqlConfig);
	connectionSync = mysqlSync.createPool(mysqlConfig);
	console.log("[DATABASE] [MARIADB] Connected.");
};

export const executeAsync = async (executionString: string) => {
	return await connectionAsync.execute(executionString);
};

export const executeSync = (executionString: string) => {
	return connectionSync.execute(executionString);
};
