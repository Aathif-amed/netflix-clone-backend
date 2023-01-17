const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors")

//importing database connnetion

const connection = require("./utils/db");

//importing routes

const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const movieRoute = require("./routes/movies");
const listRoute = require("./routes/lists");

app.use(express.json());

//DB connection
connection();

//Access Control Allow Origin 
app.use(cors({
  origin:"*"
}))

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(process.env.PORT, () => {
  console.log(`Server Listening on ${process.env.PORT}`);
});
