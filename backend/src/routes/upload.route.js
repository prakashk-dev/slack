import express from "express";
import * as Upload from "../upload";

const router = express.Router();
router.post("/", Upload.uploadOne);

export default router;
