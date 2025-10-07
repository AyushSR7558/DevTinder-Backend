const express = require("express");
const bcrypt = require("bcrypt");
const {User} = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, age, gender, emailId, password, mobileNumber } = req.body;

    const otherUserWithSameEmail = await User.findOne({ emailId: emailId });
    if (otherUserWithSameEmail) {
      throw new Error("Cannot create other user with same emailID");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      age,
      gender,
      emailId,
      password: hashPassword,
      mobileNumber
    });

    await user.save();
    res.send("User is added Sucessfullly");
  } catch (err) {
    res.status(404).send(err.message);
  }
});
module.exports = authRouter;
