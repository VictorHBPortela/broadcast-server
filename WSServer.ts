import { Auth } from "./utils/Auth.js";
import { ClientManager } from "./utils/ClientManager.js";
import { type Socket, Server } from "socket.io";
import express, { type Express } from "express";
import { createServer, type Server as HttpServer } from "node:http";

export class WSServer {
  private io: Server | null = null;
  private clientManager: ClientManager;
  private app: Express;
  private server: HttpServer;

  constructor() {
    this.clientManager = new ClientManager();
    this.app = express();
    this.server = createServer(this.app);
  }

  public start() {
    const auth = new Auth();
    this.io = new Server(this.server);

    this.server
      .listen(3000, () => {
        console.log("Server running on localhost:3000");
      })
      .on("error", (error) => {
        console.error("Server failed to start:", error);
        process.exit(1);
      });

    this.io.use((socket, next) => {
      const token = socket.handshake?.auth?.token;
      const { message, success, error } = auth.validateToken(token);
      if (!success) {
        return next(new Error(error));
      }
      console.log(message);
      next();
    });

    this.io.on("connection", (socket) => {
      this.handleConnection(socket);
    });
  }

  public handleConnection(socket: Socket) {
    console.log("User connected: ", socket.id);
    this.addClientToList(socket.id);

    socket.on("disconnect", () => {
      this.handleDisconnect(socket);
    });

    socket.on("client message", (message) => {
      this.broadcastClientMessage(socket, message);
    });
  }

  public handleDisconnect(socket: Socket): void {
    this.removeClientFromList(socket.id);
    console.log("User disconnected: ", socket.id);
  }

  public broadcastClientMessage(socket: Socket, message: string): void {
    if (!this.io) {
      console.error("Server not started. Call start() first.");
      return;
    }
    socket.broadcast.emit("client message", message);
  }

  public addClientToList(id: string): void {
    this.clientManager.addClient(id);
  }

  public removeClientFromList(id: string): void {
    this.clientManager.removeClient(id);
  }
}
