const multer = require("multer");
const { v1: uuid } = require("uuid");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload = multer({
  limits: 500000,
  storage: multer.memoryStorage(),
  onError: function (err, next) {
    console.log("error", err);
    next(err);
  },
  // storage: multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, "uploads/images");
  //   },
    // filename: (req, file, cb) => {
    //   const ext = MIME_TYPE_MAP[file.mimetype];
    //   cb(null, uuid() + "." + ext);
    // },
  //   fileFilter: (req, res, cb) => {
  //     const isValid = !!MIME_TYPE_MAP[fileUpload.mimetype];
  //     let error = isValid ? null : new Error("Invalid mimetype");
  //     cb(error, isValid);
  //   },
  // }),
});

module.exports = fileUpload;
