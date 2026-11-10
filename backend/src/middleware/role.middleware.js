const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {

    //check authentication first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission"
      });
    }

    next();
  };
};

export default authorizeRoles;
