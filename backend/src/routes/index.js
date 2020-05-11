import express from "express";
import userRoutes from "./user.route";
import groupRoutes from "./group.route";
import authenticate from "../middleware/auth";

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

router.use(authenticate);

//mount user routes at /users
router.use("/users", userRoutes);
router.use("/groups", groupRoutes);

//mount auth routes at /auth

export default router;
