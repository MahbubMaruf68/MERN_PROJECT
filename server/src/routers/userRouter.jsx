const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
} = require("../controllers/userController.jsx");
const userRouter = express.Router();

// GET: api/user
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);

module.exports = userRouter;
