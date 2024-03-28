const createError = require("http-errors");
const User = require("../models/userModel.jsx");
const mongoose = require("mongoose");

const findWithId = async (id, options = {}) => {
  try {
    const item = await User.findById(id, options);

    if (!item) {
      throw createError(404, "item does not exist with this id");
    }
    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(400, "Invalid Item Id");
    }
    throw error;
  }
};

module.exports = { findWithId };
