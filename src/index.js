const express = require("express");
require("express-async-errors");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const dbConfig = require("./config/DB");
const errorHandler = require("./middlewares/errorHandler");
const requestLogger = require("./middlewares/requestLogger");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.routes");

const UserController = require("./controllers/user.controller");

const UserRepository = require("./repositories/user.repository");

const userRepository = new UserRepository();

const userController = new UserController(userRepository);

const app = express();

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

dbConfig.connect().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
  });
});
