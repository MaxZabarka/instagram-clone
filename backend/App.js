const fs = require("fs");

const express = require("express");
const path = require("path");
const cors = require("cors");
const fileUpload = require("./middleware/file-upload");

const { createPost, getPosts } = require("./controllers/posts-controller");

const app = express();

app.use(cors());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.get("/posts", getPosts);

app.post("/posts", fileUpload.any("images"), createPost);

app.use((req, res, next) => {
  const error = new Error("Could not find this route");
  error.code = 404;
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.paths, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ errorMessage: error.message || "Unknown error occurred" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
