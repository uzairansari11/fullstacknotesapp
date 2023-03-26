/----------------importing------------------/;

const express = require("express");
const bcrypt = require("bcrypt");
const { userModel } = require("../model/user.model");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
/---------------------------------------------/;

/-----------------register with hashing-------------------/;

userRouter.post("/register", async (req, res) => {
	const { name, email, password, city } = req.body;
	const isUserExist = await userModel.find({ email: email });
	console.log(isUserExist);
	if (isUserExist.length) {
		res.send({ msg: "User already exists" ,data:["exist"]});
	} else {
		try {
			if ((name, email, password, city)) {
				bcrypt.hash(password, 6, async (err, hash) => {
					const user = new userModel({ email, password: hash, city, name });
					await user.save();
					res.status(200).send({ msg: "You're Registered Successfully!" });
				});
			} else {
				res.status(400).send({ msg: "Please provide all details!" });
			}
		} catch (error) {
			res.status(400).send({ msg: error.message });
		}
	}
});
/---------------------------------------------/;

/--------------------login hashing -------------------/;

userRouter.post("/login", async (req, res) => {
	const { email, password } = req.body;
	const user = await userModel.find({ email });

	try {
		if (user.length > 0) {
			bcrypt.compare(password, user[0].password, (err, result) => {
				result
					? res.status(200).send({
							msg: "Login Successfully!",

							token: jwt.sign({ userID: user[0]._id }, "ansari"),
					  })
					: res.status(200).send({ msg: "Wrong Credential" });
			});
		}
	} catch (error) {
		res.status(400).send({ msg: error.message });
	}
});
/---------------------------------------------/;

module.exports = { userRouter };
