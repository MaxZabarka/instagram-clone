const jwt = require("jsonwebtoken");
const getUser = require("../util/get-user");
const bycrypt = require("bcryptjs");
const validator = require("validator");

const login = async (req, res, next) => {
  try {
    //Verify userID and password with database
    //UserID could be either username or email
    const password = req.body.password;
    const userID = req.body.userID;
    const user = await getUser(userID);
    if (!user || !(await bycrypt.compare(password, user.password))) {
      throw new HttpError(
        "Your password or email was incorrect. Please double-check your credentials.",
        401
      );
    }

    let token;
    token = jwt.sign(
      { username: user.username, email: user.email, password },
      process.env.SECRET_KEY,
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

const register = async (req, res, next) => {
  try {
    const salt = await bycrypt.genSalt(10);
    hashpassword = await bycrypt.hash(req.body.password, salt);
    const username = req.body.username.toLowerCase();
    const email = validator.normalizeEmail(req.body.email);

    if (
      !validator.isAlphanumeric(username, "en-US", { ignore: "._" }) ||
      !validator.isLength(username, { min: 3, max: 15 }) ||
      !validator.isEmail(email)
    ) {
      console.log('validator.isAlphanumeric(username, "en-US", { ignore: "._" })', validator.isAlphanumeric(username, "en-US", { ignore: "._" }));
      return res.sendStatus(422);
    }
    if (
      (await db.collection("users").findOne({ username })) ||
      (await db.collection("users").findOne({ email }))
    ) {
      return res.sendStatus(409);
    }

    await db.collection("users").insertOne({
      username: req.body.username,
      password: hashpassword,
      email: req.body.email,
      following: [],
    });

    let token;
    token = jwt.sign(
      { username, email, hashpassword },
      process.env.SECRET_KEY,
      {
        expiresIn: "72h",
      }
    );

    res.status(201).json({ token, username: req.body.username });
  } catch (e) {
    return next(e);
  }
};

module.exports = { login, register };
