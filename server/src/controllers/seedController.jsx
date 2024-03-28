const data = require("../data.jsx");
const User = require("../models/userModel.jsx");

const seedUser = async (req, res, next) => {
  try {
    // Deleting all existing data
    await User.deleteMany({});

    // instering new user
    const users = await User.insertMany(data.users);

    // Successful response
    return res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { seedUser };
