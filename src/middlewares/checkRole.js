const checkRole = (roles) => async (req, res, next) => {
  const { role } = req.admin;
  if (role && roles.includes(role)) return next();
  res.status(403).send({ error: "Unauthorized" });
};

module.exports = checkRole;
