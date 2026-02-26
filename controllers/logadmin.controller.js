const logadminService = require("../services/logadmin.service");

exports.getLogadmin = async (req, res) => {
  const result = await logadminService.findAll();
  res.json(result.rows);
};

exports.addLogActionLogin = async (req, res) => {
  const { user_id, visited_at, ip, agent } = req.body;

  const result = await logadminService.addLogActionLogin(user_id, visited_at, ip, agent);
  res.json(result.rows);
};

exports.countAll = async (req, res) => {
  const result = await logadminService.countAll();
  res.json(result.rows[0]);
};