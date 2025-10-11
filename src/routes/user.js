const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const userAuth = require("../midwares/userAuth");

const userRouter = express.Router();

userRouter.get("/request/recieved",userAuth,async (req, res) => {
  const loggedInUser = req.user;

  const requests = await ConnectionRequest.find({
    toUserId: loggedInUser._id,
    status: "interested"
  });
  
  res.json({message: "Data has fetched sucessfully", data: requests})
})

module.exports = userRouter;
