const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const requestLogger = require("./middlewares/requestLogger");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
require("express-async-errors");

require("dotenv").config();

const userRoutes = require("./routes/user.routes");

const UserController = require("./controllers/user.controller");

const UserRepository = require("./repositories/user.repository");
const connectDB = require("./config/DB");

const userRepository = new UserRepository();

const userController = new UserController(userRepository);

const app = express();

connectDB(app);

const mainRouter = express.Router();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(morgan("short"));

mainRouter.use("/users", userRoutes(userController));

app.use("/api/v1", mainRouter);

app.use(errorHandler);

