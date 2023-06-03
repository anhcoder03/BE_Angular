const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json("Token không đúng");
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("Bạn chưa đăng nhập");
  }
};

const verifyTokenAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.admin) {
      next();
    } else {
      return res.status(403).json("Bạn không phải là người quản trị");
    }
  });
};

module.exports = { verifyToken, verifyTokenAdmin };