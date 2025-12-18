const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const userAuth = require("../midwares/userAuth");
const { User } = require("../models/user");
const mongoose = require("mongoose");

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

    res.json({
      message: "Connections fetched successfully!",
      data,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    const hideUserFromFeed = new Set();

    connectionRequests.forEach((r) => {
      hideUserFromFeed.add(r.fromUserId.toString());
      hideUserFromFeed.add(r.toUserId.toString());
    });

    const users = await User.aggregate([
      {
        $match: {
          _id: {
            $nin: Array.from(hideUserFromFeed).map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
            $ne: loggedInUser._id,
          },
        },
      },
      { $sample: { size: 10 } }, // random feed of 10 users
    ]);

    res.json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

userRouter.get("/findByID/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await User.findById(id);
    console.log(data);
    if (!data) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    res.status(200).json({
      data,
      message: "Record found successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = userRouter;
