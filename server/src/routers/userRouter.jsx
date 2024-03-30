const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
} = require("../controllers/userController.jsx");
const userRouter = express.Router();

// GET: api/user
userRouter.post("/process-register", processRegister);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);

module.exports = userRouter;
