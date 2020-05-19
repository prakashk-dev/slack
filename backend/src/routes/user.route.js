import express from "express";
import * as User from "../controllers/user.controller";

const router = express.Router();
router.get("/", User.list);
router.get("/:id", User.findOne);

export default router;
