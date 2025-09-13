import fs from "fs";

export const fetchOrCreateFile = (
  filePath: string,
  defaultContent: any = []
): Array<string> => {
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  }
  fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2));
  return defaultContent;
};
