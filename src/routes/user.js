const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const userAuth = require("../midwares/userAuth");

const userRouter = express.Router();

userRouter.use("/requests", userAuth, (req, res) => {
  try {
    const loggedInUser = req.user;

    const requests = ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    });

    res.json({ message: "Data fetch is successful", data });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = userRouter;
