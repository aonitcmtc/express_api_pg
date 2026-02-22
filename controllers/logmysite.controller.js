const logmysiteService = require("../services/logmysite.service");

exports.addLog = async (req, res) => {
  try {
    const { path, ip, agent, url, visited_at } = req.body;

    const result = await logmysiteService.createLog(path, ip, agent, url, visited_at);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding log:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await logmysiteService.findAll();
    res.json(result.rows);
  } catch (error) {
    console.error("Error adding log:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getbyIP = async (req, res) => {
  try {
    const result = await logmysiteService.findByIP();
    res.json(result.rows);
  } catch (error) {
    console.error("Error adding log:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getbyAgent = async (req, res) => {
  try {
    const result = await logmysiteService.findByAgent();
    res.json(result.rows);
  } catch (error) {
    console.error("Error adding log:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getbyUrl = async (req, res) => {
  try {
    const result = await logmysiteService.findByUrl();
    res.json(result.rows);
  } catch (error) {
    console.error("Error adding log:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.countLanding = async (req, res) => {
  try {
    const result = await logmysiteService.countLanding();
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding log:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.countMysite = async (req, res) => {
  try {
    const result = await logmysiteService.countMysite();
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding log:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};