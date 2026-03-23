const jwt = require("jsonwebtoken");

// TOKEN TEKSHIRISH
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token yo'q",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token noto'g'ri",
    });
  }
};

// ADMIN TEKSHIRISH
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Siz admin emassiz!",
    });
  }

  next();
};

module.exports = {
  verifyToken,
  isAdmin,
};