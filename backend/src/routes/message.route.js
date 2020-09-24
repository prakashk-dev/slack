import express from "express";
import * as Message from "../controllers/message.controller";

const router = express.Router();
router.get("/", Message.getAll);
router.get("/:user_id", Message.getByUsers);
router.post("/", Message.saveMessage);
router.patch("/:id", Message.updateMessageById);
router.delete("/:id", Message.deleteMessageById);
router.delete("/", Message.deleteAll);

export default router;
