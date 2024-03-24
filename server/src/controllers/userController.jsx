const createError = require("http-errors");
const users = require("../models/usermodel.jsx");

const getUsers = (req, res, next) => {
  try {
    res.status(200).send({
      message: "user were returned",
      users: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUsers;
