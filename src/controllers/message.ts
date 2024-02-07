import { Request, Response } from "express";
import amplib from "amqplib";

const publish = async (req: Request, res: Response) => {
  /*  #swagger.requestBody = {
            required: true,
            description: 'Publish message to queue .',
            content:{
              "application/json":{
                example: {
                queue: 'queue',
                message: "message",
              }
            }
          }
    } */
  try {
    const { queue, message } = req.body;
    const con = await amplib.connect("amqp://localhost");
    if (!con) return res.status(500).json({ message: "amqp connection error" });
    const channel = await con.createChannel();
    if (!channel)
      return res.status(500).json({ message: "amqp connection error" });
    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(message));
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const receiveMessage = async () => {
  try {
    const con = await amplib.connect("amqp://localhost");
    if (!con) throw new Error("connection error");
    const channel = await con.createChannel();
    if (!channel) throw new Error("connection error");
    await channel.assertQueue("queue", { durable: false });
    return [con, channel];
  } catch (error) {
    console.log(error);
  }
};

export { receiveMessage, publish };
