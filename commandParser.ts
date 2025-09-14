import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { connectClient, startServer } from "./handler.js";

yargs(hideBin(process.argv))
  .command(
    "start-server",
    "Start the server",
    {
      key: { type: "string", requiresArg: false },
    },
    () => {
      startServer();
    }
  )
  .command(
    "connect",
    "Connect to server",
    {
      key: { type: "string", requiresArg: false },
    },
    () => {
      connectClient();
    }
  )
  .parseSync();
