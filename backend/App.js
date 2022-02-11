require("dotenv").config();

if (!process.env.MONGODB_URI) {
  throw new Error("Provide a MONGODB_URI in .env");
}
if (!process.env.SECRET_KEY) {
  throw new Error("Provide a SECRET_KEY in .env");
}
require("./util/http-error");
const express = require("express");
const path = require("path");
const cors = require("cors");
const fileUpload = require("./middleware/file-upload");
require("./util/db");

const {
  createPost,
  deletePost,
  getPost,
  explorePosts,
  getPosts,
} = require("./controllers/posts-controller");
const { socketHandler, initWs } = require("./util/socket-handler");
const checkAuth = require("./middleware/check-auth");
const uploadProgress = require("./middleware/upload-progress");
const {
  getComments,
  postComment,
} = require("./controllers/comments-controller");
const { likePost, unlikePost } = require("./controllers/likes-controller");
const { getUser } = require("./controllers/user-controller");
const { followUser, unfollowUser } = require("./controllers/follow-controller");
const { exists } = require("./controllers/exists-controller");
const {
  savePost,
  unSavePost,
  getSavedPosts,
} = require("./controllers/save-controller");
const { login, register } = require("./controllers/auth-controller");
const { updateBio, updateProfile } = require("./controllers/edit-controller");
const { search } = require("./controllers/search-controller");

const app = express();

app.use(express.json());

app.use(cors());

app.post("/register", register);
app.post("/login", login);
app.post("/exists/", exists);
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.get("/explore", explorePosts);
app.get("/search/:query", search);

app.use(checkAuth);

app.get("/users/:username", getUser);
app.get("/comments/:id", getComments);
app.post("/comments/:id", postComment);

app.post("/like/:id", likePost);
app.post("/unlike/:id", unlikePost);

app.delete("/posts/delete/:id", deletePost);
app.get("/posts", getPosts);

app.get("/posts/:id", getPost);
app.post("/posts", socketHandler, uploadProgress, fileUpload.any(), createPost);

app.post("/follow/:id", followUser);
app.post("/unfollow/:id", unfollowUser);

app.post("/save/:id", savePost);
app.post("/unsave/:id", unSavePost);
app.get("/saved", getSavedPosts);

app.put("/update-bio", updateBio);
app.put("/update-profile", fileUpload.single("file"), updateProfile);

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

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log("Listening on port " + port);
  initWs(server);
});
