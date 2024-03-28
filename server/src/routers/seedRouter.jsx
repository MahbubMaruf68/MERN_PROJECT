const express = require("express");
const { seedUser } = require("../controllers/seedController.jsx");
const seedRouter = express.Router();

seedRouter.get("/users", seedUser);

module.exports = seedRouter;
