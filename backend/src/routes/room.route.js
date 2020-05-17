import express from "express";
import * as Room from "../controllers/room.controller";

const router = express.Router();
router.route("/").get(Room.list);
router.route("/name").get(Room.groupName);
router.route("/recent").get(Room.getRecent);
router.route("/:id").put(Room.joinRoom);
// this might be redundent
router.route("/:id/users").get(Room.getUsers);
router.route("/:id").get(Room.findById);
// router.route('/save')
//   .post(User.save);
// router.route('/:id')
//   .get(User.findOne);
// router.route('/:id')
//   .delete(User.remove);

export default router;
