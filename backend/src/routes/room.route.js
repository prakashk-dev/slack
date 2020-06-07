import express from "express";
import * as Room from "../controllers/room.controller";

const router = express.Router();
router.get("/", Room.getAll);
router.get("/name", Room.groupName);
router.get("/recent", Room.getRecent);
router.get("/:id", Room.findById);
// this might be redundent
router.get("/:id/users", Room.getUsers);

export default router;
