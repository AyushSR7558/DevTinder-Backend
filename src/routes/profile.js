const express = require("express");
const userAuth = require("../midwares/userAuth");
const { User } = require("../models/user");
const {
  validateProfileEditData,
  validatePasswordForgotData,
} = require("../utils/validateProfileEditData");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();



profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});
profileRouter.put("/edit", userAuth, async (req, res) => {
  try {
    validateProfileEditData(req);

    const logInUser = req.user;

    Object.keys(req.body).forEach(
      (field) => (logInUser[field] = req.body[field])
    );
    logInUser.save();
    res.send({
      message: `${logInUser.fullName} has been updated Sucessfully`,
      data: logInUser,
    });
  } catch (err) {
    res.status(401).send(err.message);
  }
});
profileRouter.put("/password", userAuth, async (req, res) => {
  try {
    await validatePasswordForgotData(req);
    const { newPassword } = req.body;
    if (!newPassword) {
      throw new Error("Enter the new Password");
    }
    const loggedInUser = req.user;
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = newPasswordHash;
    await loggedInUser.save();
    res.send("Password has been changed sucessfully");
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = profileRouter;
