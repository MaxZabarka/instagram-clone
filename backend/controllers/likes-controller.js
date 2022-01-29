const { ObjectId } = require("mongodb");

const likePost = async (req, res, next) => {
  try {
    result = await db.collection("posts").updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $addToSet: {
          likes: req.userData._id,
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

const unlikePost = async (req, res, next) => {
  try {
    result = await db.collection("posts").updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $pull: {
          likes: req.userData._id,
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

// const likeComment = async (req, res, next) => {
//     try {
//       result = await db.collection("posts").updateOne(
//         {
//           _id: ObjectId(req.params.id),
//         },
//         {
//           $addToSet: {
//             likes: req.userData._id,
//           },
//         }
//       );
//       if (result.matchedCount === 0) {
//         throw new HttpError("Post not found", 404);
//       }
//       res.sendStatus(200);
//     } catch (e) {
//       next(e);
//     }
//   };
  
module.exports = { likePost, unlikePost };
