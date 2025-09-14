import { io, type Socket } from "socket.io-client";
import { CLI } from "./utils/CLI.js";
import { Auth } from "./utils/Auth.js";

export class WSClient {
  private cli: CLI;
  private socket: Socket | null = null;

  constructor() {
    this.cli = new CLI();
  }

  public connect() {
    const url = "http://localhost:3000";
    const auth = new Auth();
    const token = auth.generateToken();
    this.socket = io(url, {
      auth: { token },
      timeout: 5000,
    });

    this.socket.on("connect", () => {
      this.handleConnect(this.socket!);
    });

    this.socket.on("disconnect", () => {
      this.handleDisconnect(this.socket!);
    });

    process.on("SIGINT", () => {
      this.handleDisconnect(this.socket!);
    });

    process.on("SIGTERM", () => {
      this.handleDisconnect(this.socket!);
    });

    this.socket.on("client message", (message: string) => {
      this.receiveMessage(message);
    });
  }

  public handleConnect(socket: Socket) {
    console.log("Client running... Press Ctrl+C to disconnect");
    this.cli.onLineListener((line) => socket.emit("client message", line));
    this.cli.onCloseListener(() => console.log("Exitting chat"));
  }

  public handleDisconnect(socket: Socket) {
    console.log("\nDisconnecting...");
    socket.emit("User disconnected", socket.id);
    process.exit(0);
  }

  public receiveMessage(message: string) {
    console.log(message);
  }
}
