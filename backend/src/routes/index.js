import express from "express";
import userRoutes from "./user.route";
import groupRoutes from "./group.route";

const app = express();
const router = express.Router();

//using middleware
app.use(function (req, res, next) {
  next();
});

router.get("/ping", (req, res) => {
  return res.json({ message: "OK" });
});

//mount user routes at /users
router.use("/users", userRoutes);
router.use("/groups", groupRoutes);

//mount auth routes at /auth

export default router;
