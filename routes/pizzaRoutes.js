const express = require("express");
const mongoose = require("mongoose");
const Pizza = require("../models/pizzaModel");

const router = express.Router();

router.get("/", async(req,res)=> {
    const pizzas = await Pizza.find();
    res.send(pizzas);
})

module.exports = router;