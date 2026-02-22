const db = require("../config/db");

exports.createLog = (path, ip, agent, url, visited_at) => {
  return db.query(
    "INSERT INTO logs_visitor_landing (path, ip_address, user_agent, url, visited_at) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [path, ip, agent, url, visited_at]
  );
};

exports.findAll = () => {
  return db.query("SELECT * FROM logs_visitor_landing");
};

exports.findByIP = (ip) => {
  return db.query("SELECT * FROM logs_visitor_landing WHERE ip_address=$1", [ip]);
};

exports.findByAgent = (agent) => {
  return db.query("SELECT * FROM logs_visitor_landing WHERE user_agent=$1", [agent]);
};

exports.findByUrl = (url) => {
  return db.query("SELECT * FROM logs_visitor_landing WHERE url=$1", [url]);
};

exports.countLanding = () => {
  return db.query("SELECT count(*) FROM public.logs_visitor_landing");
};

exports.countMysite = () => {
  return db.query("SELECT count(*) FROM public.logs_visitor_landing WHERE path=$1", ['/mysite']);
};


