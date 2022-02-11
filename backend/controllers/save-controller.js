const { ObjectId } = require("mongodb");

const savePost = async (req, res, next) => {
  try {
    result = await db.collection("users").updateOne(
      {
        _id: req.userData._id,
      },
      {
        $addToSet: {
          savedPosts: ObjectId(req.params.id),
        },
      }
    );
    if (result.matchedCount === 0) {
      throw new HttpError("Post not found", 404);
    }
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};

const unSavePost = async (req, res, next) => {
  try {
    result = await db.collection("users").updateOne(
      {
        _id: req.userData._id,
      },
      {
        $pull: {
          savedPosts: ObjectId(req.params.id),
        },
      }
    );
    if (result.matchedCount === 0) {
      throw new HttpError("Post not found", 404);
    }
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};

const getSavedPosts = async (req, res, next) => {
  result = await (
    await db.collection("posts").aggregate([
      {
        $match: {
          _id: {
            $in: req.userData.savedPosts,
          },
        },
      },
      {
        $addFields: {
          userLiked: {
            $in: [req.userData._id, "$likes"],
          },
          likesAmount: {
            $size: "$likes",
          },
          commentsAmount: {
            $size: "$comments",
          },
        },
      },
    ])
  ).toArray();

  res.json(result);
};
module.exports = { savePost, unSavePost, getSavedPosts };
