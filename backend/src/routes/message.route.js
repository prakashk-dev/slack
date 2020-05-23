import express from "express";
import * as Message from "../controllers/message.controller";

const router = express.Router();
router.get("/", Message.getAll);
router.get("/:user_id", Message.getByUsers);
router.post("/", Message.saveMessage);

export default router;
