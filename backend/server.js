const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/mongoDB.js");
const auth = require("./middleware/auth");
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

connectDB();

app.get("/", (req, res) => {
  res.send("Server is running!!");
});


const userRouter = require("./routes/userRoute");
app.use("/api/user", userRouter);

const discussionRouter = require("./routes/discussionRoute");
app.use("/api/discussions", discussionRouter);

const otherRouter = require("./routes/otherRoute");
app.use("/api", otherRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
