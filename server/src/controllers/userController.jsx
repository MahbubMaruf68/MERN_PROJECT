const createError = require("http-errors");
const fs = require("fs");

const User = require("../models/userModel.jsx");
const { successResponse } = require("./responsController.jsx");
const { findWithId } = require("../services/findItem.jsx");
const { error } = require("console");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || " ";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      isAdmin: { $ne: true },

      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };

    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!users) throw createError(404, "no users found");

    return successResponse(res, {
      statusCode: 200,
      message: "users were returned successfully",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPages: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(id, options);

    return successResponse(res, {
      statusCode: 200,
      message: "user were returned successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Delete User
const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(id, options);

    const userImagePath = user.image;
    fs.access(userImagePath, (err) => {
      if (err) {
        console.error("user Image does not exist");
      } else {
        fs.unlink(userImagePath, (err) => {
          if (err) throw err;
          console.log("user Image was deleted");
        });
      }
    });

    return successResponse(res, {
      statusCode: 200,
      message: "user were Deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUser, getUsers, deleteUser };
