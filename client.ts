import { io } from "socket.io-client";
import readline from "node:readline";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "TH3SN3AKYKEY";
const token = jwt.sign("BASIC_AUTH", JWT_SECRET);

export const connectServer = () => {
  let socket;

  try {
    socket = io("http://localhost:3000", {
      auth: { token },
      timeout: 5000,
    });
  } catch (error) {
    console.error("Failed to create socket connection:", error);
    return;
  }

  socket.on("connect", () => {
    console.log("Connected to server");
    console.log("Socket ID:", socket.id);

    try {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.on("line", (msg: string) => {
        try {
          socket.emit("user message", msg);
        } catch (error) {
          console.error("Failed to send message:", error);
        }
      });

      rl.on("error", (error) => {
        console.error("Readline error:", error);
      });
    } catch (error) {
      console.error("Failed to setup readline interface:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socket.on("connect_error", (error) => {
    console.log("Connection failed:", error.message);
  });

  socket.on("user message", (msg) => {
    console.log(msg);
  });

  // Keep the process alive
  console.log("Client running... Press Ctrl+C to disconnect");

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    console.log("\nDisconnecting...");
    socket.disconnect();
    process.exit(0);
  });
};
