const express = require("express");
const {
  getUsers,
  getUser,
  deleteUser,
} = require("../controllers/userController.jsx");
const userRouter = express.Router();

// GET: api/user
userRouter.get("/", getUsers);
userRouter.get("/:id", getUser);
userRouter.delete("/:id", deleteUser);

module.exports = userRouter;
