import { io } from "socket.io-client";

export const connectServer = () => {
  const socket = io("http://localhost:3000");

  socket.on("connect", () => {
    console.log("Connected to server");
    console.log("Socket ID:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socket.on("connect_error", (error) => {
    console.log("Connection failed:", error.message);
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
