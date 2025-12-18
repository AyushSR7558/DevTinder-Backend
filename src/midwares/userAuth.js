const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {User} = require(".././models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    if(!cookie) {
        throw new Error("Login to get the cookie");
    }
    const { token } = cookie;
    if (!token) {
      throw new Error("Token is required!");
    }
    const { _id } = await jwt.verify(token, process.env.key);
    if (!_id) {
      throw new Error("Id is not present!");
    }
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("The Given ID is not present in the DB");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send(err.message);
  }
};

module.exports = userAuth;
