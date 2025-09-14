import readline from "node:readline";

export class CLI {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  public onLineListener(callback: (line: string) => void) {
    this.rl.on("line", async (line: string) => {
      callback(line);
      this.rl.prompt();
    });
  }

  public onCloseListener(callback: () => void) {
    this.rl.on("close", () => {
      callback();
      process.exit(0);
    });
  }
}
