const express = require("express");
const mongoose = require("mongoose");
const Pizza = require("../models/pizzaModel");
const {protect, admin} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", async(req,res)=> {
    const pizzas = await Pizza.find();
    res.send(pizzas);
})

router.post("/addpizza", protect, admin, async(req,res)=> {
	const pizza = req.body.pizza;

	try{
	const newPizza = new Pizza({
		name: pizza.name,
		image: pizza.image,
		varients: ['small', 'medium', 'large'],
		description: pizza.description,
		category: pizza.category,
		prices: [pizza.prices] 
	});

	await newPizza.save();
	res.status(200).json({success: true});
}
	catch(e) {
		console.log(e);
		return res.status(500).json({error: e.message});
	}

})

module.exports = router;