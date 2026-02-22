const db = require("../config/db");

exports.createUser = (name, email, password) => {
  return db.query(
    "INSERT INTO dev (first_name, email, password) VALUES ($1,$2,$3) RETURNING *",
    [name, email, password]
  );
};

exports.findByEmail = (email) => {
  return db.query("SELECT * FROM dev WHERE email=$1", [email]);
};

exports.findAll = () => {
  return db.query("SELECT member_id, first_name, email FROM dev");
};

exports.findByStatus = () => {
  return db.query("SELECT count(*) FROM dev WHERE status =$1",[1]);
};