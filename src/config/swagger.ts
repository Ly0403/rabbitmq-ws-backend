import swaggerAutogen from "swagger-autogen";
import dotenv from 'dotenv'; 

dotenv.config();

const doc = {
  info: {
    title: "RABBITMQ API",
    description:
      "APIs to send message to messag broker",
  },
  host: `${process.env.HOST}:${process.env.SWAGGERPORT}`,
  schemes: ["https", "http"],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
  },
};

const routes = ["../app.ts"];

swaggerAutogen({openapi: '3.0.0'})("./swagger-output.json", routes, doc);