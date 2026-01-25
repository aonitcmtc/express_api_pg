const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userService = require("../services/user.service");
const tokenService = require("../services/token.service");

const generateAccessToken = (user) =>
  jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
  });

const generateRefreshToken = (user) =>
  jwt.sign(user, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
  });

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);
  const result = await userService.createUser(name, email, hash);

  res.json(result.rows[0]);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const result = await userService.findByEmail(email);
  if (!result.rows.length)
    return res.status(401).json({ message: "Invalid email" });

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ message: "Invalid password" });

  const payload = { id: user.member_id, email: user.email };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await tokenService.saveRefreshToken(
    user.member_id,
    refreshToken,
    expiresAt
  );

  res.json({ accessToken, refreshToken });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  const stored = await tokenService.findRefreshToken(refreshToken);
  if (!stored.rows.length)
    return res.status(403).json({ message: "Invalid refresh token" });

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const payload = { id: decoded.id, email: decoded.email };
    const newAccessToken = generateAccessToken(payload);

    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ message: "Token expired" });
  }
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  await tokenService.deleteRefreshToken(refreshToken);
  res.json({ message: "Logged out" });
};
