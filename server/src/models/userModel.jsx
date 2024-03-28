const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const { defaultImagePath } = require("../secret.jsx");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "user name is required"],
      trim: true,
      minlength: [3, "The length of user name can be maximum 3 character"],
      maxlength: [18, "The length of user name can be maximum 18 character"],
    },

    email: {
      type: String,
      required: [true, "User email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "user password is required"],
      minlength: [6, "The length of user name can be minimum 6 character"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
      type: String,
      default: defaultImagePath,
    },
    address: {
      type: String,
      required: [true, "User address is required"],
    },
    phone: {
      type: String,
      required: [true, "User phone is required"],
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model("Users", userSchema);

module.exports = User;
