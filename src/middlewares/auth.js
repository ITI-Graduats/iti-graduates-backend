const CustomError = require("../utils/CustomError");
const util = require("util");
const jwt = require("jsonwebtoken");
const jwtVerifyAsync = util.promisify(jwt.verify);

module.exports = async (req, _, next) => {
  const { authorization: accessToken } = req.headers;
  if (!accessToken) throw new CustomError("missing token!!", 401);
  try {
    const payload = await jwtVerifyAsync(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    req.admin = payload;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      error.name = "AccessTokenExpiredError";
      error.message = "Unauthorized, Access token has expired";
      error.statusCode = 401;
    }
    throw error;
  }
  next();
};
