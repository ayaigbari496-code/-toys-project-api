const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "USER" }
}, { timestamps: true });

const UserModel = mongoose.model("users", userSchema);

const validateUser = (reqBody) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(2).max(150).required(),
    email: Joi.string().min(2).max(150).email().required(),
    password: Joi.string().min(3).max(100).required(),
    role: Joi.string().valid("USER", "ADMIN").allow("", null)
  });
  return joiSchema.validate(reqBody);
};

const validateLogin = (reqBody) => {
  const joiSchema = Joi.object({
    email: Joi.string().min(2).max(150).email().required(),
    password: Joi.string().min(3).max(100).required()
  });
  return joiSchema.validate(reqBody);
};

module.exports = { UserModel, validateUser, validateLogin };
