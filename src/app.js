const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./utils/database");
const authRouter = require("./routes/auth");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/", authRouter);

connectDB()
  .then(() => {
    app.listen(PORT , () => {
      console.log(`Listening at the PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
