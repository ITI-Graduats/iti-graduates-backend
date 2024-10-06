
const checkRole = (roles) => async (req, res, next) => {
    const { role } = req.admin;
    console.log(req.admin, role)
    if (role && roles.includes(role)) return next();
    res.status(403).send("Not authorized");
};

module.exports = checkRole;
