import { WSClient } from "./WSClient.js";
import { WSServer } from "./WSServer.js";

export const startServer = () => {
  try {
    const server = new WSServer();
    server.start();
  } catch (error) {
    console.log(error);
  }
};

export const connectClient = () => {
  try {
    const client = new WSClient();
    client.connect();
  } catch (error) {
    console.log(error);
  }
};
