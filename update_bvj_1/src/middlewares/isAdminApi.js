const isAdminApi = (req, res, next) => {
  if (req.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied!" });
  }
};

module.exports = isAdminApi;
