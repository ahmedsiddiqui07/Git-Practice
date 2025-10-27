const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Valid email
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(email);
};

// Validate Password (min 8 chars, 1 letter, 1 number, 1 special char)
const isStrongPassword = (password) => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long.",
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must include at least one uppercase letter.",
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must include at least one lowercase letter.",
    };
  }
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: "Password must include at least one number.",
    };
  }
  if (!/[@$!%*#?&]/.test(password)) {
    return {
      isValid: false,
      message:
        "Password must include at least one special character (@$!%*#?&).",
    };
  }

  return { isValid: true, message: "Password is strong." };
};

//name validate
function isValidNameLength(name) {
  return typeof name === "string" && name.trim().length <= 50;
}

//password hash
const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(password, saltRounds);
    return hashedPass;
  } catch (error) {
    console.log(error);
  }
};
4//generate access token
const generateAccessToken = async (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

//Refresh Token
const generateRefreshToken = async (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
  });
};

//Compare Password
const comparePassword = async (password, hashedPass) => {
  try {
    return await bcrypt.compare(password, hashedPass);
  } catch (err) {
    // optional: log internally
    console.error("bcrypt compare error:", err);
    // Treat as non-match to avoid leaking internal errors
    return false;
  }
};

module.exports = {
  isStrongPassword,
  isValidEmail,
  isValidNameLength,
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
  comparePassword,
  sendEmail,
};
