const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    // We will define the structure of the document in this part
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    emailId: {
      type: String,
      select: false,
      trim: true,
      unique: true,
      lowercase: true,
      immutable: true,
      required: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    about: {
      type: String,
      default: "This is the default about section"
    },
    skills: {
      type: [String],
      default: undefined
    },
    isMarried: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    virtuals: {
      fullName: {
        get() {
          return this.firstName + " " + this.lastName;
        },
        set(s) {
          this.firstName = s.substr(0, s.indexOf(" "));
          this.lastName = s.substr(s.indexOf(" ") + 1);
        },
      },
    },
    methods: {
      sayName() {
        return this.name.firstName + " " + this.name.lastName;
      },
      getJWT : async function() {
        const user = this;

        const token = await jwt.sign({ _id: user._id }, process.env.key, {
          expiresIn: "1h",
        });

        return token;
      }
    },
    statics: {
      sayHello() {
        return "Hello";
      },
    },
  }
);
const User = mongoose.model("User", userSchema);
module.exports = { User };
