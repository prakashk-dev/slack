import express from "express";
import * as Auth from "../controllers/auth.controller";

const router = express.Router();
router.route("/signup").post(Auth.signup);
router.route("/login").post(Auth.login);

export default router;
