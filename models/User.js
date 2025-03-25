const mongoose = require("mongoose");
const { PreferenceSchema } = require("./Preference");
const Joi = require("joi");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [PreferenceSchema],
});

UserSchema.virtual("preferences", {
  ref: "Preference",
  localField: "_id",
  foreignField: "user",
});

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const User = mongoose.model("User", UserSchema);

module.exports = {
  User,
  registerSchema,
  loginSchema,
};
