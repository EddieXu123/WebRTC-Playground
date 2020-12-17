const express = require('express');
const app = express();
const server = require("http").Server(app); // Creates a server to be allowed with socket.io
const io = require("socket.io")(server)
const { v4 : uuidV4 } = require("uuid");

app.set("view engine", "ejs"); // How we are rendering our views
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.redirect('/${uuidV4()}')       // Create a room and direct user to that room
});

app.get("/:room", (req, res) => {
    res.render("room", {roomId : req.params.room});
});

io.on("connection", socket => {
    socket.on("join-room", (roomId, userId) => { // Whenever a user joins a room
        // We want to tell users a new user has joined
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);

        socket.on("disconnect", () => {
            socket.to(roomId).broadcast.emit("user-disconnected", userId);
        });
    })
})

server.listen(3000);