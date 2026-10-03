const mongoose = require("mongoose");
const Joi = require("joi");

const toySchema = new mongoose.Schema({
  name: { type: String, required: true },
  info: { type: String, required: true },
  category: { type: String, required: true },
  img_url: { type: String, default: "" },
  price: { type: Number, required: true },
  user_id: { type: String, required: true }
}, { timestamps: true });

const ToyModel = mongoose.model("toys", toySchema);

const validateToy = (reqBody) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(2).max(150).required(),
    info: Joi.string().min(2).max(500).required(),
    category: Joi.string().min(2).max(100).required(),
    img_url: Joi.string().min(2).max(500).allow("", null),
    price: Joi.number().min(1).max(9999).required()
  });
  return joiSchema.validate(reqBody);
};

module.exports = { ToyModel, validateToy };
