const jwt = require("jsonwebtoken");
const getUser = require("../util/get-user");

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new HttpError(
        "Authentication failed. Try logging out and logging back in.",
        401
      );
    }
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.userData = {
      ...(await getUser(decodedToken.username)),
      username: decodedToken.username,
      email: decodedToken.email,
    };
    next();
  } catch (err) {
    console.log(err);
    next(
      new HttpError(
        "Authentication failed. Try logging out and logging back in.",
        401
      )
    );
  }
};
module.exports = checkAuth;
