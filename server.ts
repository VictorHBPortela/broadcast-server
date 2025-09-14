import express from "express";
import fs from "fs";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { fetchOrCreateFile } from "./fetchOrCreateFile.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { validateToken } from "./helpers/validateToken.js";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server);
const path = "clients.json";

export const startServer = () => {
  io.use((socket, next) => {
    validateToken(socket, next);
  }).on("connection", (socket) => {
    console.log("A user connected, ID:", socket.id);
    try {
      let clients = fetchOrCreateFile(path);
      clients.push(socket.id);
      fs.writeFileSync(path, JSON.stringify(clients, null, 2));
    } catch (error) {
      console.log("Error updating client list", error);
    }

    socket.on("disconnect", (reason) => {
      console.log("User disconnected, ID:", socket.id, "Reason:", reason);
      try {
        let clients = fetchOrCreateFile(path);
        clients = clients.filter((c) => c !== socket.id);
        fs.writeFileSync(path, JSON.stringify(clients, null, 2));
      } catch (error) {
        console.log("Error removing client from list: ", error);
      }
    });

    socket.on("user message", (msg) => {
      socket.broadcast.emit("user message", msg);
    });
  });

  server
    .listen(3000, () => {
      console.log("Server running on localhost:3000");
    })
    .on("error", (error) => {
      console.error("Server failed to start:", error);
      process.exit(1);
    });
};
