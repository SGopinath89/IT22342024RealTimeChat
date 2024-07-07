const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://dinuki85:Zj6ILCyz2oyyugC6@chatapp.0tleuts.mongodb.net/?retryWrites=true&w=majority&appName=chatApp').then(()=>{
    console.log("Database connected")
}).catch((error)=>{
    console.error(error)
})

app.get("/ping", (_req, res) => {
    return res.json({ msg: "Ping Successful" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
    console.log(`Server is runing on port : ${process.env.PORT }`)
);
const io = socket(server, {
    cors: {
    origin: "http://localhost:3000",
    credentials: true,
    },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
