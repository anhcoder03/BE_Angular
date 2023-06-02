const express = require("express");
const db = require("./database/connectDB");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.use(cors());
require("dotenv").config();
const port = process.env.PORT || 8080;
db.connect();

app.listen(port, () => {
  console.log(`App đang chạy trên port ${port}`);
});
