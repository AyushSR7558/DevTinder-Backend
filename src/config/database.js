const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI,{
      dbName: 'devTinder'
    });
    console.log("Sucessfully Connected to the DataBase");
  } catch (err) {
    console.log(err.message);
    throw new Error("Error: ", err.message);
  }
};

module.exports = connectDB;
