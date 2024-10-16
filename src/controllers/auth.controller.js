const CustomError = require("../utils/CustomError");
const util = require("util");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtVerifyAsync = util.promisify(jwt.verify);
const jwtSignAsync = util.promisify(jwt.sign);
const {
  loginAdminValidationSchema,
} = require("../utils/validation/admin.validation");

class AuthController {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  async login(adminData) {
    try {
      await loginAdminValidationSchema.validate(adminData, {
        abortEarly: false,
        stripUnknown: false,
      });
    } catch (err) {
      const errorMessages = err.errors;
      throw new CustomError(errorMessages.join(", ").replace(/"/g, ""), 422);
    }

    const admin = await this.adminRepository.getAdminByEmail(adminData.email);
    if (!admin) throw new CustomError("invalid email or password", 401);
    if (!adminData.password) throw new CustomError("Password is required", 400);
    const isMatched = await bcrypt.compare(adminData.password, admin.password);
    if (isMatched) {
      const accessToken = await this.generateAccessToken(admin);
      const refreshToken = await this.generateRefreshToken(
        admin._id.toString(),
      );
      return { accessToken, refreshToken, admin };
    } else {
      throw new CustomError("invalid email or password", 401);
    }
  }

  async logout(adminId) {
    const admin = await this.adminRepository.updateAdmin(adminId, {
      refreshToken: null,
    });
    return admin;
  }

  async refreshAccessToken(incomingRefreshToken) {
    if (!incomingRefreshToken)
      throw new CustomError("Unauthorized, Refresh token is required", 401);
    const decodedToken = await jwtVerifyAsync(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const admin = await this.adminRepository.getAdminById(decodedToken?._id);
    if (!admin || incomingRefreshToken !== admin.refreshToken)
      throw new CustomError("Unauthorized, Invalid refresh token", 401);
    const accessToken = await this.generateAccessToken(admin);
    const refreshToken = await this.generateRefreshToken(admin._id);
    return { accessToken, refreshToken, admin };
  }

  async generateAccessToken(admin) {
    const accessToken = await jwtSignAsync(
      {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        ...(admin.role === "admin" && { branch: admin.branch }),
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );
    return accessToken;
  }

  async generateRefreshToken(adminId) {
    const refreshToken = await jwtSignAsync(
      {
        _id: adminId,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" },
    );
    await this.adminRepository.updateAdmin(adminId, {
      refreshToken,
    });
    return refreshToken;
  }
}

module.exports = AuthController;
