import express from "express";
import * as Group from "../controllers/group.controller";

const router = express.Router();
router.route("/").get(Group.list);
router.route("/name").get(Group.groupName);
router.route("/recent").get(Group.getRecent);
router.route("/:id").put(Group.joinRoom);
// this might be redundent
router.route("/:id/users").get(Group.getUsers);
router.route("/:id").get(Group.findById);
// router.route('/save')
//   .post(User.save);
// router.route('/:id')
//   .get(User.findOne);
// router.route('/:id')
//   .delete(User.remove);

export default router;
