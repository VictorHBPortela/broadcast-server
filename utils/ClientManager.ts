import fs from "fs";

export class ClientManager {
  private filePath: string;

  constructor(filePath: string = "clients.json") {
    this.filePath = filePath;
  }

  public addClient(id: string): void {
    try {
      let clients = this.fetchOrCreateList();
      if (clients) {
        clients.push(id);
      }
      fs.writeFileSync(this.filePath, JSON.stringify(clients, null, 2));
    } catch (error) {
      console.log("Error adding client to list", error);
    }
  }

  public removeClient(id: string): void {
    try {
      let clients = this.fetchOrCreateList();
      if (clients) {
        clients = clients.filter((c) => c !== id);
      }
      fs.writeFileSync(this.filePath, JSON.stringify(clients, null, 2));
    } catch (error) {
      console.log("Error removing client from list: ", error);
    }
  }

  private fetchOrCreateList(
    defaultContent: any = []
  ): Array<string> | undefined {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, "utf-8");
        return JSON.parse(fileContent);
      }
      fs.writeFileSync(this.filePath, JSON.stringify(defaultContent, null, 2));
      return defaultContent;
    } catch (error) {
      console.log("Error fetching client list");
    }
  }
}
