const { ObjectId } = require("mongodb");

const followUser = async (req, res, next) => {
  try {
    const result = await db
      .collection("users")
      .updateOne(
        { _id: req.userData._id },
        { $addToSet: { following: ObjectId(req.params.id) } }
      );
    res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    const result = await db
      .collection("users")
      .updateOne(
        { _id: req.userData._id },
        { $pull: { following: ObjectId(req.params.id) } }
      );
    console.log(result);
    res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
};

module.exports = { followUser,unfollowUser };
