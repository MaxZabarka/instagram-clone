const { ObjectId } = require("mongodb");

const getUser = async (req, res, next) => {
  try {
    const user = (
      await (
        await db.collection("users").aggregate(
          [
            { $match: { username: req.params.username } },
            {
              $addFields: {
                followingAmount: {
                  $size: "$following",
                },
              },
            },
            {
              $project: {
                username: 1,
                bio: 1,
                avatarUrl: 1,
                followingAmount: 1,
                followed: 1,
              },
            },
          ]
          // { username: req.params.username },
          // {
          //   projection: {
          // username: 1,
          // bio: 1,
          // avatarUrl: 1,
          //   },
          // }
        )
      ).toArray()
    )[0];
    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    let followersAmount = (
      await await db
        .collection("users")
        .aggregate([
          {
            $match: {
              following: { $in: [user._id] },
            },
          },
          {
            $count: "followersAmount",
          },
        ])
        .toArray()
    );
    if (!followersAmount[0]) {
      followersAmount = 0
    } else {
      followersAmount = followersAmount[0].followersAmount
    }
    console.log(user._id);
    const following = !!(await db.collection("users").count({
      _id: req.userData._id,
      following: user._id,
    }));

    const userPosts = await (
      await await db.collection("posts").aggregate([
        { $match: { creator: ObjectId(user._id) } },
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
            commentsAmount: 1,
            likesAmount: 1,
            imageUrls: 1,
          },
        },
      ])
    ).toArray();
    res.send({ ...user, followersAmount, following, posts: userPosts });
  } catch (e) {
    return next(e);
  }
};

module.exports = { getUser };
