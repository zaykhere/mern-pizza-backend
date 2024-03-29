const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

//Load environment vars
dotenv.config({ path: "./config.env" });

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.DB_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

//Import Routes
const pizzaRoutes = require("./routes/pizzaRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

//Apply routes
app.use("/api/pizza", pizzaRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

//Server setup
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
