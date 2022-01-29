const fs = require("fs");

require("./util/http-error");
const express = require("express");
const path = require("path");
const cors = require("cors");
const fileUpload = require("./middleware/file-upload");
require("dotenv").config();
require("./util/db");

const {
  createPost,
  deletePost,
  getPost,
  explorePosts,
  getPosts,
} = require("./controllers/posts-controller");
const socketHandler = require("./util/socket-handler");
const loginController = require("./controllers/login-controller");
const checkAuth = require("./middleware/check-auth");
const uploadProgress = require("./middleware/upload-progress");
const {
  getComments,
  postComment,
} = require("./controllers/comments-controller");
const { likePost, unlikePost } = require("./controllers/likes-controller");
const { getUser } = require("./controllers/user-controller");
const { followUser, unfollowUser } = require("./controllers/follow-controller");
const { exists } = require("./controllers/register-controller");

const app = express();

app.use(express.json());

app.use(cors());

app.post("/login", loginController);
app.post("/exists/", exists);
app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use(checkAuth);

app.get("/users/:username", getUser);

app.get("/comments/:id", getComments);
app.post("/comments/:id", postComment);

app.post("/like/:id", likePost);
app.post("/unlike/:id", unlikePost);

app.delete("/posts/delete/:id", deletePost);
app.get("/explore", explorePosts);
app.get("/posts", getPosts);

app.get("/posts/:id", getPost);
app.post("/posts", socketHandler, uploadProgress, fileUpload.any(), createPost);

app.post("/follow/:id", followUser);
app.post("/unfollow/:id", unfollowUser);



app.use((req, res, next) => {
  throw new HttpError("Couldn't find this page.", 404);
});

app.use((error, req, res, next) => {
  console.log(error);
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ errorMessage: error.message || "Unknown error occurred" });
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
