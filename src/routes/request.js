const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const userAuth = require("../midwares/userAuth");
const validate = require("../utils/validateRequestRouterData");
const { User } = require("../models/user");
const mongoose = require("mongoose");

const requestRouter = express.Router();

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    await validate(req);
    const toUserId = req.params.toUserId;
    const fromUserId = req.user._id;
    const status = req.params.status;

    const request = new ConnectionRequest({
      toUserId,
      fromUserId,
      status,
    });

    const data = await request.save();
    res.json({
      message: "Request sucessful",
      data,
    });
  } catch (err) {
    res.status(401).json({
      message: err.message,
    });
  }
});
requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["rejected", "accepted"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: `${status} is not a valid status`,
      });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
    });

    if (!connectionRequest) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    if (connectionRequest.status !== "interested") {
      return res.status(409).json({
        message: `Request already ${connectionRequest.status}`,
      });
    }

    connectionRequest.status = status;
    await connectionRequest.save();

    res.json({
      message: "Connection request updated successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = requestRouter;
