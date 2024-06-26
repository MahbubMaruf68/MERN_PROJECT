const createError = require("http-errors");
const fs = require("fs").promises;
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.jsx");
const { successResponse } = require("./responsController.jsx");
const { findWithId } = require("../services/findItem.jsx");
const { error } = require("console");
const { deleteImage } = require("../helper/deleteImage.jsx");
const { createJSONWebToken } = require("../helper/jsonWebToken.jsx");
const { jwtActivationKey, clientURL } = require("../secret.jsx");
const emailWithNodeMailer = require("../helper/email.jsx");

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

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

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
const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    const userImagePath = user.image;

    deleteImage(userImagePath);

    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });

    return successResponse(res, {
      statusCode: 200,
      message: "user was Deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// process Register
const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // exist user
    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(409, "User with this Mail is already Exist");
    }

    // JSON web Token
    const token = createJSONWebToken(
      { name, email, password, phone, address },
      jwtActivationKey,
      "20h"
    );

    // Email Data
    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `<h2>Hello ${name} !</h2>
  <p> Please Click Here To <a href="${clientURL}/api/users/activate/${token}" target="_blank">Activate Your Account</a> </p>
  `,
    };

    // Email Send With Node Mailer

    try {
      await emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, "Failed to send verification email"));
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} for completing your registration process`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

// Activate User Account
const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) {
      throw createError(404, "Token not Found");
    }
    try {
      const decoded = jwt.verify(token, jwtActivationKey);
      if (!decoded) {
        throw createError(401, "User Was Not Able To Verified");
      }

      const userExists = await User.exists({ email: decoded.email });
      if (userExists) {
        throw createError(409, "User with this Mail is already Exist");
      }

      await User.create(decoded);

      return successResponse(res, {
        statusCode: 201,
        message: "User Was Registered Successfully",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token Has Expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserById,
  getUsers,
  deleteUserById,
  processRegister,
  activateUserAccount,
};
