const app = require("../App");
const http = require("http");
const jwt = require("jsonwebtoken");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const connectedUsers = {};

io.on("connection", (socket) => {
  try {
    const token = socket.handshake.query["token"];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userID = decodedToken.username;
    connectedUsers[userID] = socket;
    console.log(Object.keys(connectedUsers));
  } catch (error) {
    socket.emit(
      "error",
      {errorMessage:"Authentication failed. Try logging out and logging back in."}
    );
  }
  try {
    socket.on("disconnect", function () {
      for (const userID in connectedUsers)
        if (connectedUsers[userID] === socket) {
          console.log("DELETE", userID);
          delete connectedUsers[userID];
          console.log(connectedUsers);
        }
    });
  } catch (error) {
    socket.emit("error", "Something went wrong. Please try again");
  }
});

socketHandler = (req, res, next) => {
  req.ws = connectedUsers[req.userData.username];
  next();
};

server.listen(4000, () => {
  console.log("listening on port 4000");
});

module.exports = socketHandler;
