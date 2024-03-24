const express = require("express");
const getUsers = require("../controllers/userController.jsx");
const userRouter = express.Router();

userRouter.get("/", getUsers);

module.exports = userRouter;
