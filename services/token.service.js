const db = require("../config/db");

exports.saveRefreshToken = (memberId, token, expiresAt) => {
  return db.query(
    "INSERT INTO refresh_tokens (member_id, token, expires_at) VALUES ($1,$2,$3)",
    [memberId, token, expiresAt]
  );
};

exports.findRefreshToken = (token) => {
  return db.query(
    "SELECT * FROM refresh_tokens WHERE token=$1 AND expires_at > NOW()",
    [token]
  );
};

exports.deleteRefreshToken = (token) => {
  return db.query("DELETE FROM refresh_tokens WHERE token=$1", [token]);
};
