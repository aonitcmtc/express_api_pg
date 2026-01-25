const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userService = require("../services/user.service");

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
  const isMatch = await bcrypt.compare(password, "$2b$10$bpLgqqoKW6KXyVX1X3I82e14bqGgSwFXCDnlhItAQ14PisKTOiDI2");

  if (!isMatch)
    return res.status(401).json({ message: "Invalid password " });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
};