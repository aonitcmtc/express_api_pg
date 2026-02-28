const userService = require("../services/user.service");
const Minio = require('minio');

exports.getUsers = async (req, res) => {
  const result = await userService.findAll();
  res.json(result.rows);
};

exports.getUserActive = async (req, res) => {
  const result = await userService.countUserActive();
  res.json(result.rows[0]);
};

exports.getUserAllActive = async (req, res) => {
  const result = await userService.getUserAllActive();
  res.json(result.rows);
};

exports.getUrlImageS3 = async (req, res) => {
  const { img } = req.body;

  // ตั้งค่า MinIO client
  const minioClient = new Minio.Client({
    endPoint: 'drive.myexpress-api.click',        // หรือ IP Server
    // port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin121'
  });

  const BUCKET = 'userspublish'; //userspublish/memberprofiles%2F
  const fileName = 'memberprofiles/'+img; //Preview - memberprofiles/devprofiles.PNG

  let url_profile = [];
  try {
    url_profile = await minioClient.presignedGetObject(
      BUCKET,
      fileName,
      60 * 15 // 5 นาที
    );

    res.json({ url_profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};