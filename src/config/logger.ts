import fs from "fs";
import path from "path";

export class Logger {
  public name: string;
  public path: string;
  public cacheSize: number;
  public cache: string[];
  constructor(name: string, dir = `./logs`, cacheSize = 50) {
    this.name = name;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    this.path = path.join(
      dir,
      `${new Date().toISOString().replace(/:/gi, "-").split(".")[0]}-${
        this.name
      }.log`
    );
    this.cacheSize = cacheSize;
    this.cache = [];
  }

  public log(level: string, message: string) {
    const output = `${
      new Date().toISOString().replace("T", " ").split(".")[0]
    } ${this.name} ${level} ${message}`;
    console.log(output);
    this.cache.push(output);
    if (this.cache.length >= this.cacheSize) {
      fs.appendFileSync(this.path, this.cache.map((l) => `${l}\n`).join(""));
      this.cache = [];
    }
  }

  public info(message: string) {
    this.log("info", message);
  }

  public debug(message: string) {
    this.log("debug", message);
  }

  public trace(message: string) {
    this.log("trace", message);
  }

  public warn(message: string) {
    this.log("warn", message);
  }

  public error(message: string) {
    this.log("error", message);
  }

  public fatal(message: string) {
    this.log("fatal", message);
  }
}
