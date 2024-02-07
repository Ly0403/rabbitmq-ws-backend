import express from "express";
import { publish } from "../controllers/message";

export const router = express.Router();

router.post("/publish", publish);

