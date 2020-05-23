import express from "express";

const router = express.Router();
router.get("/api/config", (req, res) => {
  return res.json({
    SOCKET_URL:
      process.env.NODE_ENV === "production"
        ? "https://socket.bhet-ghat.com"
        : `http://localhost:3001`,
  });
});

router.get("/", (req, res) => {
  return res.json({ msg: "OK" });
});

router.get("/ping", (req, res) => {
  return res.json({ message: "OK" });
});

// create a file during build and fetch that info
router.get("/version", (req, res) => {
  return res.json({
    Date: "09/01/2020",
    changes: {
      features: [],
      bugfix: [],
    },
  });
});

export default router;
