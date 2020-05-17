import express from "express";
import userRoutes from "./user.route";
import groupRoutes from "./group.route";
import roomRoutes from "./room.route";
import authMiddleware from "../middleware/auth";
import authenticate from "./auth.route";

const app = express();
const router = express.Router();

//using middleware
app.use(function (req, res, next) {
  next();
});

router.get("/ping", (req, res) => {
  return res.json({ message: "OK" });
});
router.get("/version", (req, res) => {
  return res.json({
    Date: "09/01/2020",
    changes: {
      features: [],
      bugfix: [],
    },
  });
});
router.use("/auth", authenticate);

router.use(authMiddleware);

// Any route placed after this point should be authenticated
router.use("/users", userRoutes);
router.use("/groups", groupRoutes);
router.use("/rooms", roomRoutes);

export default router;
