import express from "express";
import fs from "fs";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { fetchOrCreateFile } from "./fetchOrCreateFile.js";

const app = express();
const server = createServer(app);
const io = new Server(server);
const path = "clients.json";

export const startServer = () => {
  io.on("connection", (socket) => {
    console.log("A user connected, ID:", socket.id);
    let clients = fetchOrCreateFile(path);

    if (!clients.includes(socket.id)) {
      clients.push(socket.id);
      fs.writeFileSync(path, JSON.stringify(clients, null, 2));
      console.log("Client added. Current clients:", clients.length);
    } else {
      console.log("Client already exists in list");
    }

    socket.on("disconnect", (reason) => {
      console.log("User disconnected, ID:", socket.id, "Reason:", reason);
      let clients = fetchOrCreateFile(path);
      clients = clients.filter((c) => c !== socket.id);
      fs.writeFileSync(path, JSON.stringify(clients, null, 2));
      console.log("Updated clients file. Current clients:", clients.length);
    });
  });

  server.listen(3000, () => {
    console.log("Server running on localhost:3000");
  });
};
