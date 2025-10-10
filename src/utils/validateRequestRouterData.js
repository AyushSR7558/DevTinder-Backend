const ConnectionRequest = require("../models/connectionRequest");
const { User } = require("../models/user");
const mongoose = require("mongoose");

const validate = async (req) => {
    const toUserId = req.params.toUserId;
    const fromUserId = req.user._id;
    const status = req.params.status;

    // Validate whether the user is sending the random id or it is actually the Mongoose ID ??
    if(!mongoose.Types.ObjectId.isValid(toUserId) || !mongoose.Types.ObjectId.isValid(fromUserId)){
        throw new Error("There is problem in Id");
    }

    // Wheather Both Sender and Reciever are same or not
    if(toUserId == fromUserId){
        throw new Error("Reciver and Sender cannot be equal!!!");
    }

    // Validate the Status //
    const requiredResquest = ["ignored", "interested"];
    if(!requiredResquest.includes(status)){
        throw new Error(`${status} is not the proper request`);
    }
    

    // Validate the toUserId //
    const isToUserIdPresent = await User.findById(toUserId);
    // console.log(isToUserIdPresent);
    if(!isToUserIdPresent){
        throw new Error(`Unable to connect to user with id : ${toUserId}`);
    }

    // validate the Request //
    const isAlreadyPresent = await ConnectionRequest.findOne({$or: [{toUserId, fromUserId},{toUserId: fromUserId, fromUserId: toUserId}]});
    // console.log(isAlreadyPresent);
    if(isAlreadyPresent) {
        throw new Error("There is the connection made in past");
    }
}

module.exports = validate;