import express from "express";
import config from "../config";

const router = express.Router();
router.get("/config", (req, res) => {
  return res.json({
    SOCKET_URL: config.socket_url,
    env: config.env,
  });
});

router.get("/", (req, res) => {
  return res.json({ msg: "OK" });
});

// create a file during build and fetch that info
router.get("/version", (req, res) => {
  return res.sendFile(path.resolve(__dirname, "../../", "version"));
});

router.get("/ping", (req, res) => {
  return res.json({ message: "OK" });
});

export default router;
