import express from "express";
import * as User from "../controllers/user.controller";

const router = express.Router();
router.get("/", User.getAll);
router.get("/chat/:id", User.fetchUserWithChatHistory);
router.get("/groupd/:groupId", User.findGroupById);
router.get("/:id", User.findOne);
router.patch("/:id/notification", User.updateNotification); // rethink the update endpoint
router.delete("/:id", User.deleteOne);
router.get("/:id/rooms/:roomId", User.findRoomById);

export default router;
