const validator = require("validator");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

// Define field-specific validation rules
const functionsForValidation = {
  firstName: (value) => validator.isAlpha(value, "en-US", { ignore: " " }),
  lastName: (value) => validator.isAlpha(value, "en-US", { ignore: " " }),
  age: (value) => validator.isInt(value.toString(), { min: 0, max: 120 }),
  gender: (value) => ["male", "female", "other"].includes(value.toLowerCase()),
  mobileNumber: (value) =>
    validator.isMobilePhone(value, "any", { strictMode: false }),
  about: (value) => typeof value === "string" && value.length <= 300,
  skills: (value) => Array.isArray(value) && value.length <= 20,
  isMarried: (value) => new Boolean(value),
  img: (value) => value,
};

/**
 * Validates the profile edit request body.
 * Throws an error if invalid.
 */
const validateProfileEditData = (req) => {
  try {
    const allowedFields = Object.keys(functionsForValidation);
    const data = req.body;
    const forwardedFields = Object.keys(data);

    const isValidFields = forwardedFields.every((field) =>
      allowedFields.includes(field)
    );
    if (!isValidFields) {
      throw new Error("Request contains invalid or extra fields.");
    }
    forwardedFields.forEach((field) => {
      const validateFn = functionsForValidation[field];
      const value = data[field];

      if (validateFn && !validateFn(value)) {
        throw new Error(`Invalid value for field: '${field}'.`);
      }
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

const validatePasswordForgotData = async (req, res) => {
  // Get the password

  const { currPassword } = req.body;
  if (!currPassword) {
    throw new Error("Enter the Current Password");
  }
  const { password: currPasswordHash } = await User.findById(
    req.user._id
  ).select("+password");
  const isValid = await bcrypt.compare(currPassword, currPasswordHash);
  if (!isValid) {
    throw new Error("Enter the correct password");
  }
};

module.exports = { validateProfileEditData, validatePasswordForgotData };
