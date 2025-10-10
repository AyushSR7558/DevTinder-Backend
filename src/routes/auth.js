const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      age,
      gender,
      emailId,
      password,
      mobileNumber,
    } = req.body;

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
      mobileNumber,
    });

    await user.save();
    res.json({
      message: "User added sucessfully",
      data: user
    });
  } catch (err) {
    res.status(404).json({message: err.message});
  }
});
authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    if (!emailId || !password) {
      throw new Error("Please send proper email and password");
    }
    // We will have to find the user with this emailId
    const user = await User.findOne({ emailId }).select("+password");
    if (!user) {
      throw new Error("User with this email Id is not present in the DB");
    }
    const passwordHash = user.password;
    const isValid = await bcrypt.compare(password, passwordHash);
    if (isValid) {
      const cookie = await user.getJWT();
      res
        .cookie("token", cookie, {
          expires: new Date(Date.now() + 36000000),
        })
        .send(user);
    } else {
      throw new Error("invalid Credentials");
    }
  } catch (err) {
    res.status(401).send(err.message);
  }
});
authRouter.post("/logout", async (req, res) => {
  res.
    cookie("token", null, {
      expires: new Date(Date.now())
    })
    .send("Logout Sucessfully!!!")
})

module.exports = authRouter;
