const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const userAuth = require("../midwares/userAuth");
const validate = require("../utils/validateRequestRouterData");

const requestRouter = express.Router();

requestRouter.post("/:status/:toUserId", userAuth, async (req, res) => {
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
        message: err.message
    })
  }
});
module.exports = requestRouter;
