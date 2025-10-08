const validator = require("validator");

// Define field-specific validation rules
const functionsForValidation = {
  firstName: (value) => validator.isAlpha(value, "en-US", { ignore: " " }),
  lastName: (value) => validator.isAlpha(value, "en-US", { ignore: " " }),
  age: (value) => validator.isInt(value.toString(), { min: 0, max: 120 }),
  gender: (value) =>
    ["male", "female", "other"].includes(value.toLowerCase()),
  mobileNumber: (value) =>
    validator.isMobilePhone(value, "any", { strictMode: false }),
  about: (value) => typeof value === "string" && value.length <= 300,
  skills: (value) => Array.isArray(value) && value.length <= 20,
  isMarried: (value) => new Boolean(value)
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

module.exports = validateProfileEditData;
