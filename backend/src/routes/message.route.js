import express from "express";
import * as Message from "../controllers/message.controller";

const router = express.Router();
router.get("/:user_id", Message.getByUsers);

export default router;
