//----importing-----//

const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./router/user.router");
const { notesRouter } = require("./router/notes.router");
const { auth } = require('./middleware/auth.middleware')
const cors = require("cors");
require("dotenv").config();


//----------------------------------------//

const app = express();

app.use(express.json());
app.use(cors());
app.use("/users", userRouter);
app.use(auth)
app.use("/notes", notesRouter);
app.listen(process.env.port, async () => {
	try {
		await connection();
		console.log("Db connected");
	} catch (error) {
		console.log("Db  not connected");
		console.log(error);
	}
	console.log(`server is running ${process.env.port}`);
});
