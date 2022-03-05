const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();

//Load environment vars
dotenv.config({ path: "./config.env" });

app.use(express.json());

mongoose
  .connect(process.env.DB_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

//Server setup
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
