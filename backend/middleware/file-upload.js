const multer = require("multer");

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
});

module.exports = fileUpload;
