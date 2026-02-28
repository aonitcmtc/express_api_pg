const db = require("../config/db");

exports.createUser = (name, email, password) => {
  return db.query(
    `INSERT INTO public.dev (first_name, email, password, createdat, updatedat) 
      VALUES ($1,$2,$3,NOW() AT TIME ZONE 'Asia/Bangkok',NOW() AT TIME ZONE 'Asia/Bangkok') RETURNING *`,
    [name, email, password]
  );
};

exports.findByEmail = (email) => {
  return db.query("SELECT * FROM public.dev WHERE email=$1", [email]);
};

exports.findAll = () => {
  return db.query("SELECT member_id, first_name, email FROM public.dev");
};

exports.countUserActive = () => {
  return db.query("SELECT count(*) FROM public.dev WHERE status =$1",[1]);
};

exports.getUserAllActive = () => {
  return db.query(`SELECT member_id, first_name, last_name, email, img_profile, phone, sex, 
                    member_group, status, birthdate, createdat, updatedat
                    FROM public.dev
                    WHERE status = 1
                    ORDER BY member_id ASC `);
};