const express = require("express");
require("express-async-errors");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const dbConfig = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const requestLogger = require("./middlewares/requestLogger");
const auth = require("./middlewares/auth");
const checkRole = require("./middlewares/checkRole");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const trackRoutes = require("./routes/track.routes");
const branchRoutes = require("./routes/branch.routes");
const graduateRoutes = require("./routes/graduate.routes");
const registrationRequestRoutes = require("./routes/registerationRequest.routes");

const AuthController = require("./controllers/auth.controller");
const AdminController = require("./controllers/admin.controller");
const TrackController = require("./controllers/track.controller");
const BranchController = require("./controllers/branch.controller");
const GraduateController = require("./controllers/graduate.controller");
const RegistrationRequestController = require("./controllers/registerationRequest.controller");

const AdminRepository = require("./repositories/admin.repository");
const TrackRepository = require("./repositories/track.repository");
const BranchRepository = require("./repositories/branch.repository");
const GraduateRepository = require("./repositories/graduate.repository");
const RegistrationRequestRepository = require("./repositories/registerationRequest.repository");

const adminRepository = new AdminRepository();
const trackRepository = new TrackRepository();
const branchRepository = new BranchRepository();
const graduateRepository = new GraduateRepository();
const registrationRequestRepository = new RegistrationRequestRepository();

const authController = new AuthController(adminRepository);
const adminController = new AdminController(adminRepository, branchRepository);
const trackController = new TrackController(trackRepository);
const branchController = new BranchController(branchRepository);
const graduateController = new GraduateController(
  graduateRepository,
  branchRepository,
  trackRepository
);
const registrationRequestController = new RegistrationRequestController(
  registrationRequestRepository,
  graduateRepository,
  branchRepository,
  trackRepository
);

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

mainRouter.use("/auth", authRoutes(authController));
mainRouter.use("/tracks", trackRoutes(trackController));
mainRouter.use(
  "/registration-requests",
  registrationRequestRoutes(registrationRequestController)
);
mainRouter.use(
  "/admins",
  auth,
  checkRole(["super admin"]),
  adminRoutes(adminController)
);
mainRouter.use("/branches", branchRoutes(branchController));
mainRouter.use("/graduates", graduateRoutes(graduateController));

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
