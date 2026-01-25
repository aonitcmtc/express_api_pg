const userService = require("../services/user.service");

exports.getUsers = async (req, res) => {
  const result = await userService.findAll();
  res.json(result.rows);
};