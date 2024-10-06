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
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");

const UserController = require("./controllers/user.controller");
const AuthController = require("./controllers/auth.controller");
const AdminController = require("./controllers/admin.controller");

const UserRepository = require("./repositories/user.repository");
const AdminRepository = require("./repositories/admin.repository");

const userRepository = new UserRepository();
const adminRepository = new AdminRepository();

const userController = new UserController(userRepository);
const authController = new AuthController(adminRepository);
const adminController = new AdminController(adminRepository);

const app = express();

const mainRouter = express.Router();

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(morgan("short"));

mainRouter.use("/users", userRoutes(userController));
mainRouter.use("/auth", authRoutes(authController));
mainRouter.use("/admins", adminRoutes(adminController));

app.use("/api/v1", mainRouter);

app.use(errorHandler);

dbConfig
    .connect()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is listening on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error(error);
    });
