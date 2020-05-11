import express from "express";
import * as User from "../controllers/user.controller";

const router = express.Router();
router.route("/").get(User.list);
router.route("/:username").get(User.findOne);
router.route("/").post(User.loginOrRegisterUser);
// router.route('/:id')
//   .get(User.findOne);
// router.route('/:id')
//   .delete(User.remove);

export default router;
