const sharp = require("sharp");
const { v4: uuid } = require("uuid");
const fs = require("fs");

const DUMMY_DATA = [];
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const MAX_FILE_SIZE_MB = 5_000_000;
const WIDTH_RATIO = 1.91;
const HEIGHT_RATIO = 1.25;

const createPost = (req, res, next) => {
  //constraints:
  // filesize under 5mb
  // max width or height 1920px
  // aspect ratio fits
  // under 10 images
  const imageNames = [];
  let imagesWritten = 0;
  let imagesProcessed = 0;

  const imageWritten = (success) => {
    imagesProcessed++;
    if (success) imagesWritten++;
    console.log(`imagesProcessed`, imagesProcessed);
    console.log(`imagesWritten`, imagesWritten);

    if (imagesProcessed >= req.files.length) {
      if (imagesWritten >= req.files.length) {
        console.log(imageNames);
        const document = JSON.parse(req.body.document);
        DUMMY_DATA.push({
          imageUrls: imageNames,
          avatarUrl: "https://picsum.photos/200/200",
          caption: document.description,
          creator: "test.123.test",
        });
      } else {
        imageNames.forEach((imagePath) => {
          fs.unlinkSync(imagePath);
        });
      }
    }
  };

  req.files.forEach((file, index) => {
    if (!MIME_TYPE_MAP[file.mimetype]) throw new Error("Invalid mimetype");
    const folder = "uploads/images/";
    const name = uuid() + "." + "jpeg";
    const path = folder + name;
    imageNames.push(path);
    sharp(file.buffer)
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .png({ quality: 1, force: false })
      .toFile(path)
      .then((info) => {
        if (info.width > 1920 || info.height > 1920) {
          throw new Error(
            "Image cannot be larger than 1920px on either dimension"
          );
        }
        if (info.size > MAX_FILE_SIZE_MB) {
          throw new Error("Image cannot be larger than 5mb");
        }
        if (
          info.width / info.height > WIDTH_RATIO ||
          info.height / info.width > HEIGHT_RATIO
        ) {
          throw new Error("Image must fit aspect ratio");
        }
        //send
        // console.log(index);
        imageWritten(true);
      })
      .catch((error) => {
        //send
        imageWritten(false);
        console.log(error);
      });

    // Promise.allSettled(promiseArray).then((results) => {
    //   if (results.some((result) => result.status === "rejected")) {
    //     imageNames.forEach((imagePath) => {
    //       console.log(imagePath)
    //       fs.unlinkSync(imagePath);
    //     });
    //   }
    // });
    // .then((info) => {
    //   // console.log(info);
    //   // console.log(info)
    // if (info.width > 1920 || info.height > 1920) {
    //   throw new Error(
    //     "Image cannot be larger than 1920px on either dimension"
    //   );
    // }
    //   if (info.size > MAX_FILE_SIZE_MB) {
    //     throw new Error("Image cannot be larger than 5mb");
    //   }
    //   if (
    //     info.width / info.height > WIDTH_RATIO ||
    //     info.height / info.width > HEIGHT_RATIO
    //   ) {
    //     throw new Error("Image must fit aspect ratio");
    //   }
    //   //send
    //   console.log(index);
    // })
    // .catch((error) => {
    //   //delete
    //   imageNames.forEach(imagePath => {
    //     console.log(imagePath)
    //     fs.unlinkSync(imagePath)
    //   })
    //   //send
    //   console.log(error);
    // });
    // promiseArray.push(imagePromise)
  });

  //make sure image fits aspect ratio

  res.json({
    success: 1,
  });
};

const getPosts = (req, res, next) => {
  res.json(DUMMY_DATA);
};

module.exports = { createPost, getPosts };
