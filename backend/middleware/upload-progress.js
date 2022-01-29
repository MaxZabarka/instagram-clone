const uploadProgress = (req, res, next) => {
  console.log("UPLAOD PROGRESS")
  let progress = 0;
  const file_size = req.headers["content-length"];
  // set event listener
  let lastPercentage;
  req.on("data", (chunk) => {
    console.log(chunk)
    progress += chunk.length;
    const percentage = Math.ceil(((progress / file_size) * 100) / 5) * 5;
    console.log(percentage)
    if (percentage !== lastPercentage) {
      req.ws.emit("file_upload", { percentage });
      lastPercentage = percentage;
    }
  });

  // invoke next middleware
  next();
};

module.exports = uploadProgress;
