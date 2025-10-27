const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;
    if (!authHeader) {
      req.user = null;
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    const token = authHeader.split(" ")[1] || authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing user data",
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Error in auth middleware:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

// const authorize = (roles = []) => {
//   return async (req, res, next) => {
//     try {
//       const user = await User.findByPk(req.user.id, {
//         include: {
//           model: Role,
//           as: "role",
//           attributes: ["name", "is_active"],
//         },
//       });
//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       if (!user.role?.is_active) {
//         return res.status(403).json({
//           success: false,
//           message: "Forbidden: Role is inactive",
//         });
//       }

//       if (!roles.includes(user.role.name)) {
//         return res.status(403).json({
//           success: false,
//           message: "Forbidden: Insufficient role",
//         });
//       }

//       req.user.role = user.role;
//       next();
//     } catch (error) {
//       console.error("Authorize error:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Internal Server Error",
//       });
//     }
//   };
// };

const errorHandler = async (err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
module.exports = { authorize, authenticate, errorHandler };
