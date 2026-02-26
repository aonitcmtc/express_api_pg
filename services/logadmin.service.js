const db = require("../config/db");

exports.addLogActionLogin = (user_id, visited_at, ip, agent) => {
    return db.query(`INSERT INTO log_admin_login (user_id, login_time, ip_address, user_agent)
                        VALUES ($1,$2,$3,$4) RETURNING *`,[user_id, visited_at, ip, agent]);
};

exports.countAll = () => {
  return db.query("SELECT count(*) FROM public.log_admin_login");
};