import express from "express";
import * as Auth from "../controllers/auth.controller";

const router = express.Router();
router.route("/").post(Auth.loginOrRegisterUser);

export default router;
