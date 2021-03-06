require("dotenv").config();

if (!process.env.MONGODB_URI) {
  throw new Error("Provide a MONGODB_URI in .env");
}
if (!process.env.SECRET_KEY) {
  throw new Error("Provide a SECRET_KEY in .env");
}
fs = require("fs")
require("./util/http-error");
const express = require("express");
const https = require("https");
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

app.use(express.static(path.join(__dirname, '../frontend/build'),{dotfiles: 'allow'}))

app.get('*', (req, res, next) => {
	console.log("req.baseUrl", req.path)
  if (req.path.startsWith("/api")) {
    return next()
  }
  res.sendFile(path.join(__dirname + '/../frontend/build/index.html'))
})

app.post("/api/register", register);
app.post("/api/login", login);
app.post("/api/exists/", exists);
app.use("/api/uploads/images", express.static(path.join("uploads", "images")));
app.get("/api/explore", explorePosts);
app.get("/api/search/:query", search);

app.use(checkAuth);

app.get("/api/users/:username", getUser);
app.get("/api/comments/:id", getComments);
app.post("/api/comments/:id", postComment);

app.post("/api/like/:id", likePost);
app.post("/api/unlike/:id", unlikePost);

app.delete("/api/posts/delete/:id", deletePost);
app.get("/api/posts", getPosts);

app.get("/api/posts/:id", getPost);
app.post("/api/posts", socketHandler, uploadProgress, fileUpload.any(), createPost);

app.post("/api/follow/:id", followUser);
app.post("/api/unfollow/:id", unfollowUser);

app.post("/api/save/:id", savePost);
app.post("/api/unsave/:id", unSavePost);
app.get("/api/saved", getSavedPosts);

app.put("/api/update-bio", updateBio);
app.put("/api/update-profile", fileUpload.single("file"), updateProfile);


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
let options = {}
if (process.env.USE_SSL==="true") {
  console.log("using ssl")
  options = {
    key: fs.readFileSync("./ssl/key.pem"),
    cert: fs.readFileSync("./ssl/cert.pem")
  };
}

const port = process.env.PORT || 443;
const server = https.createServer(options, app).listen(port, () => {
  console.log("Listening on port " + port);
  initWs(server);
});



