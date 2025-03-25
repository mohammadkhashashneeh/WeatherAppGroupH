const {
  Preference,
  validatePreference,
  validateEditPreference,
} = require("../../models/Preference");
const { User } = require("../../models/User");

/**
 * @route GET /api/preferences
 * @desc Get all user's favorite cities
 * @access Private
 * @header Authorization: Bearer <token>
 * @returns {object} 200 - Array of favorite cities
 * @returns {object} 500 - Server error
 * @example
 * // Sample response:
 * [
 *   {
 *     "_id": "5f8d0d55b547644a7c3d8e1a",
 *     "city": "London",
 *     "user": "5f8d0d55b547644a7c3d8e19"
 *   }
 * ]
 */
const getAllPreferencesCtrl = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("preferences"); // استخدام populate لتحميل التفضيلات
    if (!user) {
      return res
        .status(400)
        .json({ message: "Login Required To Display Cities" });
    }
    res.json(user.preferences);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve preferences" });
  }
};

/**
 * @route POST /api/preferences
 * @desc Add a new favorite city
 * @access Private
 * @header Authorization: Bearer <token>
 * @param {string} req.body.city.required - City name to add
 * @returns {object} 201 - Newly created preference
 * @returns {object} 400 - Validation error
 * @returns {object} 500 - Server error
 * @example
 * // Sample request:
 * {
 *   "city": "Paris"
 * }
 */
const addPreferenceCtrl = async (req, res) => {
  const { error } = validatePreference.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { city } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ message: "Login Required To Add City" });
    }

    const newPreference = new Preference({
      city,
      user: user._id,
    });

    await newPreference.save();

    res.json(newPreference);
  } catch (error) {
    res.status(500).json({ error: "Failed to add favorite city" });
  }
};

/**
 * @route PUT /api/preferences/:id
 * @desc Update a favorite city by ID
 * @access Private
 * @header Authorization: Bearer <token>
 * @param {string} req.params.id.required - Preference ID
 * @param {string} req.body.newCity.required - New city name
 * @returns {object} 200 - Updated preference
 * @returns {object} 400 - Validation error
 * @returns {object} 404 - City not found
 * @returns {object} 500 - Server error
 * @example
 * // Sample request:
 * {
 *   "newCity": "Madrid"
 * }
 */
const updatePreferenceByIdCtrl = async (req, res) => {
  const { error } = validateEditPreference.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id } = req.params;
  const { newCity } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const preference = await Preference.findOne({
      _id: id,
      user: user._id,
    });

    if (!preference) {
      return res.status(404).json({ error: "City not found" });
    }

    if (!user._id.equals(preference.user._id)) {
      return res
        .status(404)
        .json({ error: "City not found in your favorites" });
    }

    const updatedPreference = await Preference.findByIdAndUpdate(
      id,
      {
        $set: {
          city: newCity,
        },
      },
      { new: true }
    );

    res.json(updatedPreference);
  } catch (error) {
    console.error("Error updating favorite city:", error);
    res.status(500).json({ error: "Failed to update favorite city" });
  }
};

/**
 * @route DELETE /api/preferences/:id
 * @desc Delete a favorite city by ID
 * @access Private
 * @header Authorization: Bearer <token>
 * @param {string} req.params.id.required - Preference ID
 * @returns {object} 200 - Success message
 * @returns {object} 404 - City not found
 * @returns {object} 500 - Server error
 * @example
 * // Sample response:
 * {
 *   "Message": "Deleted"
 * }
 */
const deletePreferenceByIdCtrl = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const preference = await Preference.findById(id);
    if (!preference) {
      return res.status(404).json({ error: "City not found" });
    }

    if (!user._id.equals(preference.user._id)) {
      return res
        .status(404)
        .json({ error: "City not found in your favorites" });
    }
    const deletedFavorite = await Preference.findByIdAndDelete(id);

    if (!deletedFavorite) {
      return res.status(404).json({ error: "City not found" });
    }

    res.json({ Message: "City has been Deleted" });
  } catch (error) {
    console.error("Error deleting favorite city:", error);
    res.status(500).json({ error: "Failed to delete favorite city" });
  }
};

module.exports = {
  getAllPreferencesCtrl,
  addPreferenceCtrl,
  updatePreferenceByIdCtrl,
  deletePreferenceByIdCtrl,
};
