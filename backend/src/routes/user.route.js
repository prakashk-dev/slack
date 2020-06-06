import express from "express";
import * as User from "../controllers/user.controller";

const router = express.Router();
router.get("/:id/chat", User.fetchUserWithChatHistory);
router.get("/groupd/:groupId", User.findGroupById);
router.patch("/:id/notification", User.updateNotification); // rethink the update endpoint
router.get("/:id/rooms/:roomId", User.findRoomById);
router.delete("/:id", User.deleteOne);
router.get("/:id", User.findOne);
router.patch("/:id", User.updateOneById);
router.get("/", User.getAll);

export default router;
