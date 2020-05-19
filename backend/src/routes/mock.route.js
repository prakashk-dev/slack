import express from "express";
import * as Mock from "../mock";

const router = express.Router();
router.post("/", Mock.seed);
router.delete("/", Mock.unseed);

export default router;
