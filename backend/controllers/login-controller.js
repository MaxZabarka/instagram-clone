const jwt = require("jsonwebtoken");
const getUser = require("../util/get-user");

const loginController = async (req, res, next) => {
  try {
    //Verify userID and password with database
    //UserID could be either username or email
    const userID = req.body.userID;
    const password = req.body.password;
    const user = await getUser(userID);
    if (!user || user.password !== password) {
      throw new HttpError(
        "Your password or email was incorrect. Please double-check your credentials.",
        401
      );
    }

    let token;
    token = jwt.sign(
      { username: user.username, email: user.email, password },
      "very_secret_do_not_share_ok",
      {
        expiresIn: "72h",
      }
    );

    res
      .status(201)
      .json({ token, username: user.username, avatarUrl: user.avatarUrl });
  } catch (e) {
    next(e);
  }
};
module.exports = loginController;
