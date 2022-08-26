const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();


const app = express();
const httpServer = createServer(app);


const io = new Server(httpServer, {
  pingTimeout: 40000,
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());


//serve static assets in production
// const __dirname = path.resolve();
// if (process.env.NODE_ENV === "production") {
//   //set static folder
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }


io.on("connection", (socket) => {
  console.log("socket io connection established");

  socket.on("setUp", (name) => {
    // console.log(name);
    socket.join("single_space");
    socket.emit("connected");
  });

  socket.on("send-new-message", ({ message, name }) => {
    // let users = message.chat.users;
    if (!name) return console.log("user not defined");
    // console.log(message)

    // users.forEach((el) => {
    //   if (el === message.sender._id) return;
      socket.in("single_space").emit("recieve-new-message", message);
      // socket.emit("recieve-new-message", message);
    // });
  });
});

// listen to server
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});