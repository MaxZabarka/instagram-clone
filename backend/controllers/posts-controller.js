const sharp = require("sharp");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const { ObjectId } = require("mongodb");

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

  if (req.files.length > 10) {
    throw new HttpError("Cannot post more than 10 images", 400);
  }

  const imageNames = [];
  let imagesWritten = 0;
  let imagesProcessed = 0;
  const imageWritten = (success) => {
    imagesProcessed++;
    if (success) imagesWritten++;
    if (imagesProcessed >= req.files.length) {
      if (imagesWritten >= req.files.length) {
        const document = JSON.parse(req.body.document);
        db.collection("posts").insertOne({
          imageUrls: imageNames,
          avatarUrl: req.userData.avatarUrl,
          caption: document.description,
          creator: ObjectId(req.userData._id),
          dateAdded: new Date(),
          likes: [],
          comments: [],
        });
      } else {
        imageNames.forEach((imagePath) => {
          fs.unlinkSync(imagePath);
        });
      }
    }
  };

  const socket = req.ws;
  req.files.forEach((file, index) => {
    if (!MIME_TYPE_MAP[file.mimetype])
      throw new HttpError("Invalid mimetype", 400);
    const folder = "uploads/images/";
    const name = uuid() + "." + "jpeg";
    const path = folder + name;
    imageNames.push(path);

    const image = sharp(file.buffer);

    image
      .metadata()
      .then((info) => {
        const resizeOptions = {};

        if (info.width > 1920 || info.height > 1920) {
          if (info.width >= info.height) {
            resizeOptions.width = 1920;
          } else {
            resizeOptions.height = 1920;
          }
        }
        return image.resize(resizeOptions);
      })
      .then(() => image.toFormat("jpeg"))
      .then(() => image.jpeg({ quality: 80 }))
      .then(() => image.toFile(path))
      .then((info) => {
        if (info.size > MAX_FILE_SIZE_MB) {
          throw new HttpError("Image cannot be larger than 5mb", 400);
        }
        if (
          info.width / info.height > WIDTH_RATIO ||
          info.height / info.width > HEIGHT_RATIO
        ) {
          throw new HttpError("Image must fit aspect ratio", 400);
        }
        //send
        socket.emit("image_processed", { index });
        imageWritten(true);
      })
      .catch((error) => {
        //send
        socket.emit("error", {
          errorMessage: "Something went wrong processing the images.",
        });
        imageWritten(false);
        console.log(error);
      });
  });
  res.sendStatus(200);
};

const explorePosts = async (req, res, next) => {
  try {
    const result = await (
      await db.collection("posts").aggregate([
        {
          $addFields: {
            likesAmount: {
              $size: "$likes",
            },
            commentsAmount: {
              $size: "$comments",
            },
          },
        },
        { $sort: { dateAdded: -1 } },
        {
          $project: {
            imageUrls: 1,
            likesAmount: 1,
            commentsAmount: 1,
          },
        },
      ])
    ).toArray();
    res.json(result);
  } catch (e) {
    return next(e);
  }
};
const POSTS_PER_PAGE = 5;
const getPosts = async (req, res, next) => {
  try {
    const following = (
      await db.collection("users").findOne({ _id: req.userData._id })
    ).following;
    const result = await (
      await db.collection("posts").aggregate([
        {
          $match: {
            creator: { $in: [...following, req.userData._id] },
          },
        },
        { $sort: { dateAdded: -1 } },
        { $skip: POSTS_PER_PAGE * req.query.page },
        { $limit: POSTS_PER_PAGE },
        {
          $lookup: {
            from: "users",
            localField: "creator",
            foreignField: "_id",
            as: "creator",
          },
        },
        {
          $unwind: "$creator",
        },
        {
          $addFields: {
            userLiked: {
              $in: [req.userData._id, "$likes"],
            },
            likesAmount: {
              $size: "$likes",
            },
          },
        },
        {
          $project: {
            comments: 0,
            likes: 0,
            "creator.email": 0,
            "creator.password": 0,
            "creator.bio": 0,
            "creator.following": 0,
            "creator.savedPosts": 0,
          },
        },
      ])
    ).toArray();

    await Promise.all(
      result.map(async (post) => {
        post.saved = !!(await db.collection("users").count({
          _id: req.userData._id,
          savedPosts: post._id,
        }));
      })
    );
    res.json(result);
  } catch (e) {
    return next(e);
  }
};

const getPost = async (req, res, next) => {
  try {
    const result = await (
      await db.collection("posts").aggregate([
        { $match: { _id: ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "users",
            localField: "creator",
            foreignField: "_id",
            as: "creator",
          },
        },
        {
          $unwind: "$creator",
        },
        {
          $addFields: {
            userLiked: {
              $in: [req.userData._id, "$likes"],
            },
            likesAmount: {
              $size: "$likes",
            },
          },
        },
        {
          $project: {
            comments: 0,
            "creator.email": 0,
            "creator.password": 0,
            "creator.bio": 0,
            "creator.following": 0,
          },
        },
      ])
    ).toArray();
    if (result && result.length) {

      const saved = !!(await db.collection("users").count({
        _id: req.userData._id,
        savedPosts: ObjectId(req.params.id),
      }));
      result[0].saved = saved;
      res.json(result[0]);
    } else {
      return next(new HttpError("Post not found", 404));
    }
  } catch (e) {
    if (e.name === "BSONTypeError") {
      return next(new HttpError("Post not found", 404));
    }
    return next(e);
  }
};

const deletePost = async (req, res, next) => {
  let post;
  try {
    post = await db
      .collection("posts")
      .findOne({ _id: ObjectId(req.params.id) });
    if (!post) {
      return next(new HttpError("Post could not be found"), 404);
    }
  } catch (e) {
    return next(new HttpError("Post could not be found"), 404);
  }

  if (!post.creator.equals(req.userData._id)) {
    return next(new HttpError("You are not allowed to  delete this post"), 403);
  }
  await db.collection("posts").deleteOne({ _id: post._id });

  res.sendStatus(200);
};

module.exports = { createPost, getPosts, explorePosts, deletePost, getPost };
