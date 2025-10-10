const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const cookieParser = require("cookie-parser");
const requestRouter = require("./routes/request");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

app.use("/request", requestRouter);
app.use("/profile", profileRouter);
app.use("/", authRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening at the PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
