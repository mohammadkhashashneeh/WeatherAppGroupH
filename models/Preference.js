const mongoose = require("mongoose");
const Joi = require("joi");

const PreferenceSchema = new mongoose.Schema({

  city: { type: String, required: true },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const validatePreference = Joi.object({

  city: Joi.string().min(2).required(),
  
});

const validateEditPreference = Joi.object({
  newCity: Joi.string().min(2).required(),
});

const Preference = mongoose.model("Preference", PreferenceSchema);

module.exports = {
  Preference,
  PreferenceSchema,
  validatePreference,
  validateEditPreference,
};

 

