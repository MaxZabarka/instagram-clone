const { ObjectId } = require("mongodb");

const getComments = async (req, res, next) => {
  res.json(
    await db
      .collection("posts")
      .aggregate([
        {
          $match: {
            _id: ObjectId(req.params.id),
          },
        },
        {
          $unwind: "$comments",
        },
        { $sort: { "comments.dateAdded": -1 } },
        {
          $lookup: {
            from: "users",
            localField: "comments.creator",
            foreignField: "_id",
            as: "comments.creator",
          },
        },
        {
          $unwind: {
            path: "$comments.creator",
          },
        },
        {
          $group: {
            _id: "$_id",
            comments: {
              $push: "$comments",
            },
          },
        },
        {
          $unwind: {
            path: "$comments",
          },
        },
        {
          $project: {
            _id: 0,
            likes: 0,
            "comments.creator.following":0,
            "comments.creator.password": 0,
            "comments.creator.email": 0,
            "comments.creator._id": 0,
          },
        },
      ])
      .toArray()
  );
};

const postComment = async (req, res, next) => {
  await db.collection("posts").updateOne(
    { _id: ObjectId(req.params.id) },
    {
      $push: {
        comments: {
          dateAdded: new Date(),
          content: req.body.content,
          creator: req.userData._id,
        },
      },
    }
  );
  res.sendStatus(200);
};

module.exports = { getComments, postComment };
