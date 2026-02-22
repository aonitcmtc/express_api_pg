const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userService = require("../services/user.service");
const tokenService = require("../services/token.service");

const Minio = require('minio'); // cloud images

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

  // ตั้งค่า MinIO client
  const minioClient = new Minio.Client({
    endPoint: 'drive.myexpress-api.click',        // หรือ IP Server
    // port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin121'
  });

  const BUCKET = 'userspublish'; //userspublish/memberprofiles%2F
  const fileName = 'memberprofiles/'+user.img_profile; //Preview - memberprofiles/devprofiles.PNG

  let url_profile = [];
  try {
      url_profile = await minioClient.presignedGetObject(
      BUCKET,
      fileName,
      // 60 * 5 // 5 นาที
    );

    // res.json({ url_profile });
  } catch (err) {
    // res.status(500).json({ error: err.message });
  }
  
const payload = { id: user.member_id, email: user.email };
  const user_data = { 
    id: user.member_id, 
    email: user.email, 
    name: user.first_name+" "+user.last_name,
    profile: url_profile, 
    sex: user.sex, 
    membergroup: user.member_group, 
    status: user.status
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const expiresAt = new Date();
  // expiresAt.setDate(expiresAt.getDate() + 7);
  expiresAt.setTime(expiresAt.getTime() + (15 * 60 * 1000)); // 15 นาที
  // expiresAt.setTime(expiresAt.getTime() + (60 * 60 * 1000)); // 60 นาที

  await tokenService.saveRefreshToken(
    user.member_id,
    refreshToken,
    expiresAt
  );

  res.json({ accessToken, refreshToken, user_data });
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

exports.getToken = async (req, res) => {
  const { apikey } = req.body;

  // Buffer.from(apikey, "utf8").toString("base64"); // encode
  const apiencode = Buffer.from(apikey, "base64").toString("utf8"); //decode
  const parsed = JSON.parse(apiencode);
  const email = parsed.email;
  const password = parsed.password;

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
  // expiresAt.setTime(expiresAt.getTime() + (15 * 60 * 1000)); // 15 นาที
  // expiresAt.setTime(expiresAt.getTime() + (60 * 60 * 1000)); // 60 นาที
  expiresAt.setTime(expiresAt.getTime() + (24 * 60 * 60 * 1000)); // 24 ชั่วโมง

  await tokenService.saveRefreshToken(
    user.member_id,
    refreshToken,
    expiresAt
  );

  res.json({ accessToken, refreshToken });
};