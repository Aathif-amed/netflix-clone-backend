const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.Mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅DB Connection Succesfull..!");
  })
  .catch(() => {
    console.log("❌DB Connection Failed..!");
  });

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(process.env.PORT, () => {
  console.log(`Server Listening on ${process.env.PORT}`);
});
