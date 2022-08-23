const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
// const axios = require("axios");

dotenv.config();
// const connectDB = require("./utils/db.js");
// const ErrorResponse = require("./utils/ErrorResponse");
// const errorHandler = require("./middlewares/error");

// const cookieParser = require("cookie-parser");

//importing routes
// const authRoutes = require("./routes/auth");
// const postRoutes = require("./routes/post");
// const userRoutes = require("./routes/user");
// const chatRoutes = require("./routes/chat");
// const messageRoutes = require("./routes/message");

// security middlewares
// import mongoSanitize from "express-mongo-sanitize";
// import helmet from "helmet";
// import xssClean from "xss-clean";
// import rateLimit from "express-rate-limit";
// import hpp from "hpp";

const app = express();
const httpServer = createServer(app);

// connect to database
// connectDB(process.env.MONGO_URI);

const io = new Server(httpServer, {
  pingTimeout: 40000,
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
// app.use(cookieParser());
app.use(cors());
// app.use(fileUpload());

// Sanitize data
// app.use(mongoSanitize());

// Set security headers
// app.use(helmet({ contentSecurityPolicy: false }));

// Prevent XSS attacks
// app.use(xssClean());

// add hpp
// app.use(hpp());

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000,
//   max: 50,
// });
// app.use(limiter);

// all routes
// app.use("/api/auth", authRoutes);
// app.use("/api/post", postRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/message", messageRoutes);

//serve static assets in production
// const __dirname = path.resolve();
// if (process.env.NODE_ENV === "production") {
//   //set static folder
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

// 404 handling
// app.use((req, res, next) => {
//   return next(new ErrorResponse("Page not found", 404));
// });

// error handling middleware
// app.use(errorHandler);

// io.on("connection", (socket) => {
//   console.log("socket io connection established");

//   socket.on("setUp", (user) => {
//     console.log(user.name);
//     socket.join(user._id);
//     socket.emit("connected");
//   });

//   socket.on("join-chat-room", (chatId) => {
//     socket.join(chatId);
//     console.log(`Chat room ${chatId} joined`);
//   });

//   socket.on("typing", (room) => socket.in(room).emit("typing"));
//   socket.on("stop-typing", (room) => socket.in(room).emit("stop-typing"));

//   socket.on("send-new-message", ({ message, room }) => {
//     let users = message.chat.users;
//     if (!users) return console.log("users no  defined");

//     users.forEach((el) => {
//       if (el === message.sender._id) return;
//       socket.in(el).emit("recieve-new-message", message);
//     });
//   });
// });

// listen to server
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
