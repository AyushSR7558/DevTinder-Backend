const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const userAuth = require("../midwares/userAuth");

const userRouter = express.Router();

userRouter.get("/request/recieved", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  const requests = await ConnectionRequest.find({
    toUserId: loggedInUser._id,
    status: "interested",
  }).populate("fromUserId", "firstName lastName");

  res.json({ message: "Data has fetched sucessfully", data: requests });
});
userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName");

    // ✅ Always compare ObjectIds as strings
    const loggedInUserIdStr = loggedInUser._id.toString();

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUserIdStr) {
        return row.toUserId; // other user
      }
      return row.fromUserId; // other user
    });

    console.log(data);

    res.json({
      message: "Connections fetched successfully!",
      data,
    });
  } catch (err) {
    console.error("Error fetching connections:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = userRouter;
