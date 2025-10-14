const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const cookieParser = require("cookie-parser");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5176",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/user", userRouter);
app.use("/request", requestRouter);
app.use("/profile", profileRouter);
app.use("/", authRouter);

connectDB()
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });
