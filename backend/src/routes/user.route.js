import express from "express";
import * as User from "../controllers/user.controller";

const router = express.Router();
router.route("/").get(User.list);
router.route("/unique").get(User.uniqueUsername);
router.route("/:username").get(User.findOne);
router.route("/").post(User.saveUser);
// router.route('/:id')
//   .get(User.findOne);
// router.route('/:id')
//   .delete(User.remove);

export default router;
