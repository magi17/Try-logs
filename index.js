const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { exec } = require("child_process");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("command", (cmd) => {
        exec(cmd, (error, stdout, stderr) => {
            let output = stdout || stderr;
            if (error) output = error.message;
            io.emit("log", output);
        });
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
