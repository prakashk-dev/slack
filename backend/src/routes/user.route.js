import express from "express";
import * as User from "../controllers/user.controller";

const router = express.Router();
router.get("/", User.getAll);
router.get("/:id", User.findOne);
router.delete("/:id", User.deleteOne);
router.get("/groupd/:groupId", User.findGroupById);
router.get("/:id/rooms/:roomId", User.findRoomById);

export default router;
