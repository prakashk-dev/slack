import express from "express";
import userRoutes from "./user.route";
import groupRoutes from "./group.route";
import roomRoutes from "./room.route";
import authMiddleware from "../middleware/auth";
import authenticate from "./auth.route";
import uploadRoute from "./upload.route";
import mockRoute from "./mock.route";
import publicRoute from "./public.route";
import MessageRoute from "./message.route";

const router = express.Router();

router.use("/", publicRoute);

// limit this to the dev only
router.use("/mock", mockRoute);

router.use("/auth", authenticate);
router.use(authMiddleware);

// Any route placed after this point should be authenticated
router.use("/users", userRoutes);
router.use("/groups", groupRoutes);
router.use("/rooms", roomRoutes);
router.use("/upload", uploadRoute);
router.use("/messages", uploadRoute);

export default router;
