import app from "./app";

const port = 5555;
app.listen(port, () => {
	console.log(`Listening: http://localhost:${port}!`);
});
