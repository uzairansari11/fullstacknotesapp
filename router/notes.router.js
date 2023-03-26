const express = require("express");
const { NoteModel } = require("../model/note.model");
const jwt = require("jsonwebtoken");
const notesRouter = express.Router();

notesRouter.post("/add", async (req, res) => {
	const payload = req.body;
	const { title, body, subject, userID } = payload;

	try {
		if (title && body && subject && userID) {
			const notesBody = req.body;
			console.log("getting from post notes body", notesBody);
			const notes = new NoteModel(notesBody);
			await notes.save();
			res.status(200).send({ msg: "Notes Added successfully" });
		} else {
			res.status(401).send({ msg: "Please Provide All The Fields" });
		}
	} catch (error) {
		res.status(400).send({ msg: error.message });
	}
});

notesRouter.get("/", async (req, res) => {
	const token = req.headers.authorization.split(" ")[1];
	console.log(token);
	const decoded = jwt.verify(token, "ansari");
	console.log(decoded);
	try {
		const notes = await NoteModel.find({ userID: decoded.userID });
		res.status(200).send(notes);
	} catch (error) {
		res.status(400).send({ msg: error.message });
	}
});

notesRouter.patch("/update/:id", async (req, res) => {
	const id = req.params.id;
	const payload = req.body;
	const token = req.headers.authorization.split(" ")[1];

	const decoded = jwt.verify(token, "ansari");

	const notes = await NoteModel.findOne({ _id: id });

	const userID_in_notes = notes.userID;
	const req_ID = decoded.userID;

	try {
		if (req_ID === userID_in_notes) {
			await NoteModel.findByIdAndUpdate({ _id: id }, payload);
			res.status(200).send({ msg: "Notes updated successfully" });
		} else {
			res.status(400).send({ msg: "Not Authorized" });
		}
	} catch (error) {
		res.status(400).send({ msg: error.message });
	}
});

notesRouter.delete("/delete/:id", async (req, res) => {
	const id = req.params.id;

	const token = req.headers.authorization.split(" ")[1];

	const decoded = jwt.verify(token, "ansari");

	const notes = await NoteModel.findOne({ _id: id });

	const userID_in_notes = notes.userID;
	const req_ID = decoded.userID;

	try {
		if (req_ID === userID_in_notes) {
			await NoteModel.findByIdAndDelete({ _id: id });
			res.status(200).send({ msg: "Notes updated successfully" });
		} else {
			res.status(400).send({ msg: "Not Authorized" });
		}
	} catch (error) {
		res.status(400).send({ msg: error.message });
	}
});

module.exports = { notesRouter };
