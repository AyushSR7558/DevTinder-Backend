const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: ["ignore", "interested", "accepted", "rejected"],
        message: `{Value} is incorrect status type`,
        required: true
    }
},{
    timestamps: true,
}
)

const ConnectionRequest = mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = ConnectionRequest;