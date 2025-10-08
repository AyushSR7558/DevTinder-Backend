const express = require("express");
const userAuth = require("../midwares/userAuth");
const { User } = require("../models/user");
const validateProfileEditData = require("../utils/validateProfileEditData");

const profileRouter = express.Router();

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});
profileRouter.put("/edit", userAuth, async (req, res) => {
  try {
    validateProfileEditData(req);
    
    const logInUser = req.user;

    Object.keys(req.body).forEach((field) => logInUser[field] = req.body[field]);
    logInUser.save();
    res.send({
      message: `${logInUser.fullName} has been updated Sucessfully`,
      data: logInUser
    })
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = profileRouter;
