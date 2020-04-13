import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the app");
});

const port = process.env.PORT || "8080";

app.listen(port, () => {
  console.log(
    `Application is running on Env: ${process.env.NODE_ENV} in port ${port}`
  );
});
