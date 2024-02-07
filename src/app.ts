/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import * as swaggerUi from "swagger-ui-express";
import swaggerFile from "./config/swagger-output.json";
import bodyParser from "body-parser";
import { router as messageRoutes } from "./routes/message";
import dotenv from "dotenv";
import { Logger } from "./config/logger";
import WebSocket from "ws";
import http from "http";
import { receiveMessage } from "./controllers/message";

dotenv.config();
const app = express();
const prefix = "/api/v1";

// body parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// swagger routes only for dev
if (process.env.NODE_ENV === "DEV") {
  app.use(`${prefix}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerFile));
}

app.use("/sendMessage", messageRoutes);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
try {
  // web socker start
  wss.on("connection", (ws) => {
    ws.on("message", (msg, isBinary) => {
      console.log(msg.toString());
    });
  });
  // web socker end
  server.listen(process.env.PORT, () => {
    console.log(`The app is listening on port ${process.env.PORT}`);
    const logger = new Logger("app");
    logger.info(`The app is listening on port ${process.env.PORT}`);
  });
} catch (error) {
  console.log(error);
}

// when a message received in RabbitMQ
// send something to the clients
try {
  receiveMessage()
    .then((res: any) => {
      const [con, channel] = res;
      channel.consume("queue", (msg: any) => {
        wss.clients.forEach((v) => {
          if (v.readyState === WebSocket.OPEN) v.send(msg.content.toString());
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
} catch (error) {
  console.log(error);
}
