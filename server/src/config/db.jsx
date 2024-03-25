const mongoose = require("mongoose");
const { mongodbURL } = require("../secret.jsx");
const connectDataBase = async (options) => {
  try {
    await mongoose.connect(mongodbURL, options);
    console.log("Connection to DB is successfully established");

    mongoose.connection.on("error", (error) => {
      console.error("DB connection error:", error);
    });
  } catch (error) {
    console.error("Could not connected DB:", error.toString());
  }
};

module.exports = connectDataBase;
