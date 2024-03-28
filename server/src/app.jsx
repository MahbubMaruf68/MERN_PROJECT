const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routers/userRouter.jsx");
const seedRouter = require("./routers/seedRouter.jsx");
const { errorResponse } = require("./controllers/responsController.jsx");

const app = express();

const rateLimiter = rateLimit({
  window: 1 * 60 * 1000,
  max: 5,
  message: "Too many RequestFrom this IP. Try Again Later",
});

app.use(rateLimiter);
app.use(xssClean());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/seed", seedRouter);

app.get("/test", (req, res) => {
  res.status(200).send({
    message: "api is working",
  });
});

// client error handling

app.use((req, res, next) => {
  next(createError(404, "Route not Found"));
});
// server error
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
