const express = require("express");
require("express-async-errors");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const dbConfig = require("./config/DB");
const errorHandler = require("./middlewares/errorHandler");
const requestLogger = require("./middlewares/requestLogger");
const cookieParser = require("cookie-parser");
const auth = require("./middlewares/auth");
const checkRole = require("./middlewares/checkRole");

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const trackRoutes = require("./routes/track.routes");

const UserController = require("./controllers/user.controller");
const AuthController = require("./controllers/auth.controller");
const AdminController = require("./controllers/admin.controller");
const TrackController = require("./controllers/track.controller");

const UserRepository = require("./repositories/user.repository");
const AdminRepository = require("./repositories/admin.repository");
const TrackRepository = require("./repositories/track.repository");

const userRepository = new UserRepository();
const adminRepository = new AdminRepository();
const trackRepository = new TrackRepository();

const userController = new UserController(userRepository);
const authController = new AuthController(adminRepository);
const adminController = new AdminController(adminRepository);
const trackController = new TrackController(trackRepository);

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
mainRouter.use("/tracks", trackRoutes(trackController));
mainRouter.use(
    "/admins",
    auth,
    checkRole(["super admin"]),
    adminRoutes(adminController)
);

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
